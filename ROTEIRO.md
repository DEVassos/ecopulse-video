# ROTEIRO FINAL E TIMELINE - ECOPULSE (SPRINT 3) - v3 PADRONIZADO

- **Duração estimada:** ~3 min e 55 s (235 s)
- **Formato:** Vídeo-as-Code (Remotion 1920x1080 @ 30fps ou 60fps)

## Instruções para o ElevenLabs

- Gere um arquivo `.mp3` separado para cada cena (`cena1.mp3` até `cena8.mp3`).
- Configuração de voz recomendada: Stability 0.35, Similarity 0.75, Style 0.35.
- O texto abaixo já contém as tags de emoção `[entre colchetes]` e as pausas `(...)`.
- Mantenha as tags em inglês (ex: `[curious]`, `[dramatic]`) para a IA entender a direção de atuação, mas o texto em português.

---

## CENA 1: O GANCHO PREMIUM (0:00 - 0:25)

Tom de voz: Autoritário, intrigante e confiante.

**[NARRAÇÃO - cena1.mp3]:**

> "[curious] Sua empresa sabe... [pause] quanto a infraestrutura de TI custa em carbono? [short pause] O EcoPulse traduz métricas de servidores em consumo real de energia e emissões de CO₂. [confident] E mais do que isso: [emphasis] nós mostramos exatamente onde você pode economizar. [warmly, proud] Bem-vindos ao GreenOps na prática."

**[DIREÇÃO VISUAL / REMOTION]:**

- 0:00–0:08: Exibe `00_home_to_login.mp4` (tela inicial). Kinetic Typography sobrepõe "Quanto sua infraestrutura custa em carbono?" sem cobrir o texto principal da Home.
- 0:08–0:12: O vídeo flui naturalmente para a tela de login.
- 0:12–0:18: Corte para `01_login_typing.mp4` (digitando e-mail e senha).
- 0:18: Push-in (Zoom In) rápido no botão "Entrar".
- Final: Transição "whoosh" revelando o globo da Cena 2.

---

## CENA 2: O MAPA E A SIMULAÇÃO (0:25 - 1:00)

Tom de voz: Empolgado, fluido e imersivo.

**[NARRAÇÃO - cena2.mp3]:**

> "[inspiring, confident] Tudo começa com a visão global. [short pause] Enquanto dashboards comuns usam mapas genéricos, o EcoPulse utiliza imagens de [emphasis] satélite reais. [pause] Cada ponto representa uma região ativa. [active] Navegue pelo globo, dê zoom e clique em um data center. [confident] A plataforma cruza o consumo da sua API com a matriz elétrica local... [dramatic pause] instantaneamente. [emphasis, warm] E já aponta a alternativa mais limpa: migrar a carga para Toronto e reduzir as emissões em [emphasis] oitenta e seis por cento."

**[DIREÇÃO VISUAL / REMOTION]:**

- Inicia com `02_globe_rotation.mp4` (scale 1.0 -> 1.15).
- Na fala "Navegue pelo globo...", corta para `03_globe_zoom.mp4`.
- Na pausa dramática, entra `04_simulation_reveal.mp4` com Zoom In no card de 86,44% e badge verde brilhante.

---

## CENA 3: INVESTIGAÇÃO DE EMISSÕES (1:00 - 1:35)

Tom de voz: Analítico, focado e esclarecedor.

**[NARRAÇÃO - cena3.mp3]:**

> "[curious, analytical] Mas o que explica as variações ao longo do tempo? [pause] Na aba de emissões, você investiga o [emphasis] histórico completo. [short pause] O EcoPulse agrupa os dados em intervalos claros. [active, confident] Você identifica rapidamente os picos de emissão... [short pause] acompanha a média... [pause] e, se precisar analisar tendências de longo prazo, [emphasis, resolute] alterna com um clique para a visão [emphasis] acumulada."

**[DIREÇÃO VISUAL / REMOTION]:**

- Exibe `05_emissions_chart.mp4`.
- Zoom leve nos gráficos durante os filtros.
- Card glassmorphism no canto inferior esquerdo: "Histórico • Picos • Visão Acumulada".

---

## CENA 4: COMPARAÇÃO E CAUSA RAIZ (1:35 - 2:20)

Tom de voz: Tom de descoberta ("plot twist"), revelador.

**[NARRAÇÃO - cena4.mp3]:**

> "[confident, authoritative] O verdadeiro poder de decisão está na comparação lado a lado. [short pause] [intrigued] Repare nesta [emphasis] discrepância: [slowly, dramatic] o Reporting Batch consome mais energia que o Audit Stream... mas emite [emphasis] dez vezes menos carbono. [revealing, confident] O cruzamento das curvas responde o porquê: [analytical, clear] ele coloca o peso de cada carga contra o impacto da matriz elétrica local. [firm, proud] Nós não apenas apontamos o problema; [emphasis] nós provamos a [emphasis] causa raiz."

**[DIREÇÃO VISUAL / REMOTION]:**

- Dois trechos em tela cheia (não split): `06_compare_services.mp4` até 10,24s
  e `07_compare_scatter.mp4` do 10,24s ao fim.
- Card glassmorphism inferior direito: "Carga não é emissão • A matriz elétrica
  local decide".

---

## CENA 5: RELATÓRIOS E EXPORTAÇÃO CORPORATIVA (2:20 - 2:55)

Tom de voz: Consultivo, seguro e resolutivo.

**[NARRAÇÃO - cena5.mp3]:**

> "[confident, consultative] Para transformar dados em ação, o EcoPulse gera relatórios inteligentes usando [emphasis] regras fixas e auditáveis... [slightly dramatic, emphasis] sem IA alucinada. [short pause] [helpful, clear] Mas o dado só tem valor se ele puder circular. [confident] Exporte relatórios completos em PDF ou CSV a partir de qualquer tela. [short pause] [analytical] Leve a análise para uma planilha, integre com outras ferramentas ou use como documento oficial de governança. [warmly, a bit slower] E olha o detalhe de produto: o PDF se adapta para o tema claro, economizando tinta e pronto para a diretoria. Documentação na prática."

**[DIREÇÃO VISUAL / REMOTION]:**

- Inicia com `08_report_pareto.mp4` em tela cheia, mostrando o Relatório de
  forma geral.
- Em 4,7s, na fala "...regras fixas e auditáveis... sem IA alucinada", entra um
  card no canto superior direito: **"Como este relatório é gerado / Regras
  fixas e auditáveis • Zero IA generativa"**, com barra de gradiente verde e a
  expressão "Zero IA generativa" em verde-lima para puxar o olho. Sai em 8,7s.
- Em 13,6s, na fala "Exporte relatórios completos em PDF ou CSV", o cartão do
  **PDF Executivo** (`images/pdf/relatorio.png`) desliza da direita, com barra
  de título de arquivo.
- Em 22,4s o fundo escurece (scrim `#04100C` a 50%) para o PDF ganhar primeiro
  plano. O vídeo termina em 22,92s e o último frame fica **congelado**, sem
  corte seco.
- Entre 17,4s e 21,4s, na fala "documento oficial de governança", as outras
  **três exportações** entram espalhadas pela tela — Comparação de Serviços,
  Emissões e Dashboard — cada uma com um flash branco rápido de "exportando".
  Elas **permanecem até o fim da cena**, formando a galeria dos quatro PDFs.
- Em 26,8s, selo animado com efeito de **carimbo**: "Tema Claro • Economia de
  Tinta / Vale para todas as exportações" (escala 2,2 → 1, rotação -22° → -7°).
  Fica **centralizado no meio da tela**, sobre os quatro documentos, para falar
  de todos de uma vez em vez de destacar um só.

---

## CENA 6: MATURIDADE E TRANSPARÊNCIA (2:55 - 3:15)

Tom de voz: Sóbrio, técnico e confiável.

**[NARRAÇÃO - cena6.mp3]:**

> "[serious, authoritative] Tudo isso protegido por autenticação e [emphasis] controle de acesso corporativo. [short pause] [transparent, revealing] E com total transparência matemática: [technical, clear] nossa página de ajuda documenta [emphasis] todas as fórmulas usadas nos cálculos de potência e carbono. [reassuring, firm] Aqui, você sabe exatamente... como cada número é gerado."

**[DIREÇÃO VISUAL / REMOTION]:**

- Exibe `09_help_formulas.mp4`.
- Card glassmorphism na base digita `P = CPU% × 1 + RAM × 0.375`.

---

## CENA 7: GESTÃO DE ACESSO E CONVITES (3:15 - 3:40)

Tom de voz: Corporativo, seguro e objetivo.

**[NARRAÇÃO - cena7.mp3]:**

> "[corporate, secure] E para ambientes corporativos, o acesso também é controlado. [short pause] [helpful, clear] O administrador pode convidar novos integrantes informando o e-mail e definindo seu nível de permissão: usuário ou administrador. [pause] [confident, firm] Com um clique, o EcoPulse gera um convite exclusivo, com validade definida, pronto para ser compartilhado. Simples, seguro e sob controle da empresa."

**[DIREÇÃO VISUAL / REMOTION]:**

- Exibe a gravação da tela de Configurações (Admin).
- Destaque no painel "Convidar pessoa".
- Animação acompanhando a digitação do e-mail e seleção do papel.
- Destaque no clique de "Gerar convite".
- Exibe o link gerado com opção "Copiar".
- Texto flutuante: "Acesso controlado • Convites individuais".

---

## CENA 8: FECHAMENTO (3:40 - 3:55)

Tom de voz: Inspirador, firme e conclusivo.

**[NARRAÇÃO - cena8.mp3]:**

> "[inspiring, authoritative] Visão geral... [short pause] investigação... [short pause] e decisão. [long pause] [warm, proud] EcoPulse: [slowly] conectando monitoramento, dados e sustentabilidade digital."

**[DIREÇÃO VISUAL / REMOTION]:**

- Frase centralizada: "Visão geral, investigação e decisão."
- Badge: "Conheça o projeto no estande • Equipe DEVassos".
- Fade final para `logo.png`. Loop retorna para o frame inicial (Home).

---

## Checklist de arquivos na pasta `public/` do Remotion

**Áudio**

- `public/audio/cena1.mp3` ... `cena8.mp3`
- `public/audio/bg_music.mp3`

**Vídeos**

- `public/videos/00_home_to_login.mp4`
- `public/videos/01_login_typing.mp4`
- `public/videos/02_globe_rotation.mp4`
- `public/videos/03_globe_zoom.mp4`
- `public/videos/04_simulation_reveal.mp4`
- `public/videos/05_emissions_chart.mp4`
- `public/videos/06_compare_services.mp4`
- `public/videos/07_compare_scatter.mp4`
- `public/videos/08_report_pareto.mp4`
- `public/videos/09_help_formulas.mp4`
- `public/videos/10_settings_invite.mp4` (Vídeo da Cena 7)

**Imagens**

- `public/images/logo.png`
- `public/images/pdf_export.jpg`
