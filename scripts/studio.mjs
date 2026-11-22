#!/usr/bin/env node
/**
 * Liga, desliga e inspeciona o Remotion Studio em background.
 *
 *   npm run studio:start     # sobe e devolve o terminal
 *   npm run studio:stop      # encerra (SIGTERM, com SIGKILL de reserva)
 *   npm run studio:status    # está rodando?
 *
 * O PID do processo é gravado em .studio.pid. Como o Studio sobe com
 * `detached`, ele lidera o próprio grupo de processos: um sinal no PID
 * negativo derruba npx + node + esbuild de uma vez.
 *
 * Detalhe que vale saber: um grupo de processos sobrevive à morte do líder.
 * Então, se o npx morrer por crash mas os filhos continuarem escutando na
 * porta, o stop ainda consegue limpar — e se até o .studio.pid se perder,
 * há uma varredura de segurança em /proc antes de declarar "parado".
 *
 * Para o modo tradicional (terminal preso ao processo, Ctrl+C encerra),
 * continue usando `npm run dev`.
 */
import {execFileSync, spawn} from 'node:child_process';
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import net from 'node:net';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PID_FILE = path.join(ROOT, '.studio.pid');
const PORT = Number(process.env.STUDIO_PORT ?? 3000);
const URL = `http://localhost:${PORT}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isAlive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

/** O grupo ainda tem algum processo vivo? */
const groupAlive = (pgid) => {
  try {
    process.kill(-pgid, 0);
    return true;
  } catch {
    return false;
  }
};

/** Sinal no grupo inteiro; cai para o PID isolado se não houver grupo. */
const groupSignal = (pgid, sig) => {
  for (const target of [-pgid, pgid]) {
    try {
      process.kill(target, sig);
      return true;
    } catch {
      continue;
    }
  }
  return false;
};

const readPid = () => {
  if (!existsSync(PID_FILE)) {
    return null;
  }
  const pid = Number.parseInt(readFileSync(PID_FILE, 'utf8').trim(), 10);
  return Number.isInteger(pid) && pid > 0 ? pid : null;
};

/**
 * Grupos de processos que parecem ser o Studio, lendo /proc.
 * Usado só como rede de segurança quando o .studio.pid não basta.
 */
const scanStudioGroups = () => {
  const groups = new Set();
  let entries;

  try {
    entries = readdirSync('/proc');
  } catch {
    return [];
  }

  for (const name of entries) {
    if (!/^\d+$/.test(name) || Number(name) === process.pid) {
      continue;
    }

    try {
      const cmdline = readFileSync(`/proc/${name}/cmdline`, 'utf8').replace(
        /\0/g,
        ' '
      );

      if (!/remotion/i.test(cmdline) || !/studio/i.test(cmdline)) {
        continue;
      }
      // Não confunda este próprio script com o Studio.
      if (/studio\.mjs/.test(cmdline)) {
        continue;
      }

      const stat = readFileSync(`/proc/${name}/stat`, 'utf8');
      // Formato: pid (comm) state ppid pgrp ... — comm pode conter espaços.
      const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
      const pgrp = Number.parseInt(fields[2], 10);

      if (Number.isInteger(pgrp) && pgrp > 0) {
        groups.add(pgrp);
      }
    } catch {
      continue; // processo morreu durante a varredura, ou sem permissão
    }
  }

  return [...groups];
};

const portInUse = () =>
  new Promise((resolve) => {
    const socket = net.connect({port: PORT, host: '127.0.0.1'});
    const settle = (result) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(700);
    socket.once('connect', () => settle(true));
    socket.once('error', () => settle(false));
    socket.once('timeout', () => settle(false));
  });

const portHint = () => {
  console.error(`Para ver o dono da porta:  ss -ltnp | grep ${PORT}`);
};

const start = async (openBrowser) => {
  const recorded = readPid();

  if (recorded !== null && isAlive(recorded)) {
    console.log(`Studio já está rodando (PID ${recorded}) em ${URL}`);
    return 0;
  }
  rmSync(PID_FILE, {force: true});

  const stray = scanStudioGroups();
  if (stray.length > 0 || (await portInUse())) {
    console.error(`Já existe Studio vivo (grupo ${stray.join(', ') || '?'}).`);
    console.error('Rode: npm run studio:stop');
    return 1;
  }

  // Mesmo pré-passo do `npm run dev`: regenera durações a partir dos áudios.
  console.log('Lendo áudios e vídeos de public/ ...');
  execFileSync(
    process.execPath,
    [path.join(ROOT, 'scripts', 'scan-assets.mjs')],
    {cwd: ROOT, stdio: 'inherit'}
  );

  const child = spawn(
    'npx',
    openBrowser ? ['remotion', 'studio'] : ['remotion', 'studio', '--no-open'],
    {cwd: ROOT, detached: true, stdio: 'ignore'}
  );
  child.unref();

  if (child.pid === undefined) {
    console.error('Falha ao iniciar o Studio.');
    return 1;
  }
  writeFileSync(PID_FILE, String(child.pid));

  process.stdout.write('Subindo o Studio');
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await portInUse()) {
      console.log(`\nPronto: ${URL}  (PID ${child.pid})`);
      console.log('Para parar: npm run studio:stop');
      return 0;
    }
    if (!isAlive(child.pid)) {
      console.log('\nO processo morreu antes de abrir a porta.');
      rmSync(PID_FILE, {force: true});
      return 1;
    }
    process.stdout.write('.');
    await sleep(500);
  }

  console.log(`\nNão abriu a porta em 60s (PID ${child.pid} segue vivo).`);
  return 1;
};

const stop = async () => {
  const recorded = readPid();
  const busy = await portInUse();

  if (recorded === null && !busy) {
    console.log(`Nada rodando: sem PID registrado e porta ${PORT} livre.`);
    return 0;
  }

  const targets = new Set();

  // O grupo sobrevive à morte do líder, então vale tentar mesmo com PID "morto".
  if (recorded !== null && groupAlive(recorded)) {
    targets.add(recorded);
  }
  if (recorded === null || busy) {
    for (const group of scanStudioGroups()) {
      targets.add(group);
    }
  }

  if (targets.size === 0) {
    rmSync(PID_FILE, {force: true});
    if (busy) {
      console.error(
        `Porta ${PORT} ocupada por um processo que não parece ser o Studio.`
      );
      portHint();
      return 1;
    }
    console.log('Nada rodando.');
    return 0;
  }

  const groups = [...targets];
  for (const group of groups) {
    groupSignal(group, 'SIGTERM');
  }

  let remaining = groups.filter(groupAlive);
  for (let i = 0; i < 50 && remaining.length > 0; i++) {
    await sleep(100);
    remaining = remaining.filter(groupAlive);
  }

  const forced = remaining.length > 0;
  if (forced) {
    for (const group of remaining) {
      groupSignal(group, 'SIGKILL');
    }
    for (let i = 0; i < 20 && remaining.length > 0; i++) {
      await sleep(100);
      remaining = remaining.filter(groupAlive);
    }
  }

  rmSync(PID_FILE, {force: true});

  if (await portInUse()) {
    console.error(
      `Porta ${PORT} continua ocupada depois de encerrar ${groups.join(', ')}.`
    );
    portHint();
    return 1;
  }

  console.log(
    `Studio encerrado${forced ? ' à força' : ''} (grupo ${groups.join(', ')}).`
  );
  return 0;
};

const status = async () => {
  const recorded = readPid();
  const busy = await portInUse();

  if (recorded !== null && isAlive(recorded)) {
    console.log(
      `Rodando (PID ${recorded}) — ${URL}${busy ? '' : ' (ainda subindo)'}`
    );
    return 0;
  }

  const stray = scanStudioGroups();
  if (stray.length > 0 || busy) {
    console.error(
      `Atenção: Studio vivo sem registro válido (grupo ${
        stray.join(', ') || 'desconhecido'
      }).`
    );
    console.error('Rode: npm run studio:stop');
    return 1;
  }

  if (recorded !== null) {
    rmSync(PID_FILE, {force: true});
    console.log(`Parado (PID ${recorded} obsoleto, removido do .studio.pid).`);
    return 0;
  }

  console.log('Parado.');
  return 0;
};

const command = process.argv[2];

const run = async () => {
  if (command === 'start') {
    return start(process.argv.includes('--open'));
  }
  if (command === 'stop') {
    return stop();
  }
  if (command === 'status') {
    return status();
  }
  console.error('Uso: node scripts/studio.mjs <start|stop|status> [--open]');
  return 2;
};

process.exitCode = await run();
