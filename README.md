# EcoPulse — Vídeo de Apresentação (GreenOps)

Vídeo de estande para o **EcoPulse**, um SaaS de GreenOps que mede, investiga e
reduz a pegada de carbono de infraestrutura de TI.

Feito em [Remotion](https://remotion.dev) (React → vídeo). Narração já gravada,
telas do produto ainda em gravação — enquanto faltam os `.mp4`, cada cena mostra
automaticamente o print correspondente do app com um selo de prévia.

- **Duração:** ~2 min 29 s (derivada do áudio, ver [Linha do tempo](#linha-do-tempo))
- **Formato:** 1920×1080 · 60 fps
- **Idioma:** Português (BR)

---

## Começando

```bash
npm install
npm run dev      # abre o Remotion Studio em localhost:3000
```

Requisitos: Node `^20.19 || ^22.13 || >=24` e ~2 GB de RAM livre para renderizar
em 1080p.

---

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Abre o Studio (roda `scan` antes). |
| `npm run scan` | Lê `public/audio/*.mp3` e `public/videos/*.mp4` e regenera `src/config/generated/`. |
| `npm run build` | Gera o bundle em `build/` (roda `scan` antes). |
| `npm run render` | Renderiza o vídeo completo em `out/ecopulse-main.mp4`. |
| `npm run render:short` | Renderiza a versão curta em `out/ecopulse-short.mp4`. |
| `npm run still` | Renderiza um frame: `npm run still -- out/frame.png --frame=120`. |
| `npm run lint` | `eslint src` + `tsc --noEmit`. |

> **Sempre rode `npm run scan`** depois de gravar/regravar áudio ou vídeo. O
> `dev` e o `build` já fazem isso automaticamente; `render` não faz.

---

## Composições

| ID | Descrição |
| --- | --- |
| `EcoPulseMain` | Vídeo completo, 7 cenas com narração e trilha. |
| `EcoPulseShort` | Loop de ~1 min 19 s para estande/redes: cenas 1 → 2 → 3 → 7. |
| `Cenas/Cena1-Hook` … `Cenas/Cena7-Outro` | Cada cena isolada, com áudio, para revisão rápida. |

A versão curta é só um subconjunto de cenas — as duas usam o mesmo
`EcoPulseComposition`, então qualquer ajuste visual vale para as duas.

---

## Linha do tempo

A duração de cada cena **não é escolhida à mão**: ela vem da duração real do
arquivo de narração + um respiro (`tailSeconds`). Regravou o áudio? Rode
`npm run scan` e o vídeo se reajusta sozinho — nada dessincroniza.

```
src/config/generated/audio.ts   ← gerado: { cena1: 18.286, cena2: 27.559, ... }
src/config/timeline.ts          ← consome, calcula frames e posições
```

Configurações em [`src/config/timeline.ts`](src/config/timeline.ts):

- `TIMELINE_CONFIG.scenes` — rótulo, headline, arquivo de áudio e respiro de cada cena.
- `transitionInFrames` — duração do crossfade. **Precisa ficar em sincronia** com
  o `<TransitionSeries>`; `getSceneSlots()` usa o mesmo valor para calcular onde
  cada cena começa.
- `getSceneSlots()` — fonte única da posição global de cada cena (usada pelo
  ducking da trilha e pelas checagens de frame).

Marcos internos das cenas são **frações** da duração, não segundos fixos:

- `CENA2_MOMENTS` — divisão da Cena 2 (rotação → zoom → simulação).
- `CENA5_PDF_REVEAL` — quando o PDF entra em tela na Cena 5.
- `CENA6_FORMULA` — fórmula exibida no efeito de máquina de escrever.

---

## Gravando os vídeos de tela

1. Grave em **1920×1080 (16:9)**, 60 fps, sem cursor piscando.
2. Salve com o nome exato em `public/videos/`:

   | Arquivo | Cena | Conteúdo |
   | --- | --- | --- |
   | `01_globe_rotation.mp4` | 2 | Rotação do globo 3D |
   | `02_globe_zoom.mp4` | 2 | Zoom em um datacenter regional |
   | `03_simulation_reveal.mp4` | 2 | Painel de simulação / alternativa limpa |
   | `04_emissions_chart.mp4` | 3 | Gráfico de emissões e séries temporais |
   | `05_compare_services.mp4` | 4 | Tabela de comparação |
   | `06_compare_scatter.mp4` | 4 | Dispersão carga × região |
   | `07_report_pareto.mp4` | 5 | Relatório executivo / Pareto |
   | `08_help_formulas.mp4` | 6 | Central de ajuda e fórmulas |

3. Rode `npm run scan`.
4. Pronto — `SafeVideo` detecta o arquivo e passa a usar o vídeo. Se o arquivo
   ainda não existir, cai automaticamente no print de fallback.

O mapa vídeo → print de fallback, rótulo e especificações fica em
[`src/config/assets.ts`](src/config/assets.ts). `PENDING_VIDEOS` lista o que
ainda falta gravar.

---

## Selos de prévia (`showPlaceholders`)

Enquanto os vídeos não existem, cada tela mostra um selo **PRÉVIA** e o caminho
do arquivo esperado. Esses selos **nunca** podem aparecer no vídeo final:

| Contexto | Valor | Efeito |
| --- | --- | --- |
| Studio | padrão (`true`) | Selos visíveis |
| `npm run render` | `--props='{"showPlaceholders":false}'` | Selos ocultos |

A leitura está centralizada em [`src/config/preview.ts`](src/config/preview.ts).
Para conferir o render final de um frame:

```bash
npx remotion still EcoPulseMain out/frame.png --frame=3400 \
  --props='{"showPlaceholders":false}'
```

---

## Estrutura

```
public/
  audio/    cena1..cena7.mp3 (narração) + bg_music.mp3
  fonts/    Inter e JetBrains Mono (variáveis, auto-hospedadas)
  images/   prints do app + páginas do PDF renderizadas
  pdfs/     relatórios originais
  videos/   ← onde entram as gravações de tela (.mp4)

scripts/
  scan-assets.mjs      lê durações reais de MP3 e gera os manifestos

src/
  Root.tsx             registra as composições
  Composition.tsx      <TransitionSeries> + ducking da trilha
  index.css            Tailwind + tokens de fonte (@theme)

  config/
    timeline.ts        durações, textos e marcos das cenas
    layout.ts          constantes de enquadramento (larguras 16:9)
    theme.ts           cores, sombras, fontes
    fonts.ts           loadFont (bloqueia o frame até carregar)
    assets.ts          mapa vídeo → print de fallback
    preview.ts         gate dos selos de prévia
    generated/         ⚠ gerado por `npm run scan` — não editar à mão

  components/
    BrowserFrame.tsx   moldura de navegador com área de conteúdo 16:9 rígida
    SafeVideo.tsx      usa o .mp4 se existir, senão o print com Ken Burns
    SafeAudio.tsx      áudio com fades (smoothstep, ciente do fps)
    SafeImage.tsx      imagem com fade-in
    SceneShell.tsx     casca padrão de cena + cabeçalho + narração

  scenes/
    Cena1Hook … Cena7Outro
```

---

## Enquadramento

Todas as capturas do app são **1366×768 (16:9)**. O `BrowserFrame` mantém a área
de conteúdo rígida em `aspect-ratio: 16/9` e os vídeos usam `object-contain`,
então nada é cortado nem esticado — independente da resolução que você gravar.

As larguras ficam em [`src/config/layout.ts`](src/config/layout.ts) e são
múltiplos de 16 para que a altura caia em pixel inteiro:

- `FULL_SCREEN_WIDTH = 1536` → conteúdo 1536×864
- `SPLIT_PANEL_WIDTH = 848` → cada painel da Cena 4 com 848×477, `SPLIT_GAP = 80`

---

## Áudio

- **Narração:** `public/audio/cenaN.mp3`, montada uma vez por cena pelo
  `SceneShell`, com fade-in de 0,12 s e fade-out de 0,25 s.
- **Trilha:** contínua, fora do `<TransitionSeries>`, com loop e *ducking* — cai
  de `0.1` para `0.035` enquanto há narração e volta suavemente no intervalo
  entre cenas. Fade-in de 1,2 s e fade-out de 2 s.

---

## Notas de manutenção

- `src/config/generated/` é **gerado**. Não edite; rode `npm run scan`.
- `transitionInFrames` precisa ser igual no `Composition.tsx` e no cálculo de
  `getSceneSlots()`. Mudou um, mude o outro.
- `tsconfig.json` tem `noUnusedLocals: true` — import não usado quebra o build.
- Neste ambiente não há `ffprobe`/`ffmpeg` no PATH; por isso
  `scripts/scan-assets.mjs` lê os cabeçalhos de frame do MP3 por conta própria.
- ⚠ `public/audio/bg_music.mp3` tem só ~5 s e é tocado em loop (~30×). Trocar por
  uma faixa de 2–3 min elimina a repetição perceptível no trecho final. Basta
  sobrescrever o arquivo e rodar `npm run scan`.
- Prints do PDF são gerados com `pdftoppm` a 110 DPI
  (`public/images/relatorio-pdf-1.png`, `relatorio-pdf-2.png`).
