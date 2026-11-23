# Melhorias para a apresentação (22/11/2026)

## O que mudou

- **Telas mais nítidas.** As gravações (`public/videos/*.mp4`, 1376×776) e os prints (`public/images/*.png`, 1366×768) foram ampliados para 1536×864, o tamanho exato da área de conteúdo do `<BrowserFrame>` (`FULL_SCREEN_WIDTH`). A ampliação usa Lanczos com um realce leve, então o navegador do Remotion não precisa mais esticar a imagem (era isso que borrava o texto).
  - Vídeos: `ffmpeg -vf "scale=1536:864:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,format=yuv420p" -r 60 -c:v libx264 -preset medium -crf 12 -tune stillimage -an`
  - Prints: Pillow, `resize((1536, 864), LANCZOS)` + `UnsharpMask(radius=1.2, percent=60, threshold=2)`
  - `logo.png` e `relatorio-pdf-*.png` ficaram como estavam (outros tamanhos).
- **Sem tela de carregamento na Cena 1.** Em `src/config/timeline.ts`, o trecho de `01_login_typing.mp4` virou dois: 13,8–25,4 s (digitação até "Entrando...") e 28,6–33,6 s (dashboard já carregado). Os 3,2 s de "Carregando serviços..." ficaram de fora, e a duração da cena não mudou.
- **Barra de endereço.** O segundo trecho mostra `app.ecopulse.greenops.io/dashboard` em vez de `/login`.

## Como o MP4 final foi gerado

```bash
npm install
npm run scan
npx remotion render EcoPulseMain out/ecopulse-main.mp4 --props='{"showPlaceholders":false}' \
  --codec=h264 --crf=14 --x264-preset=medium --jpeg-quality=100 --audio-codec=aac --audio-bitrate=320k
```

Depois, o áudio foi normalizado para o padrão do YouTube (−14 LUFS, pico −1,5 dBTP), copiando o vídeo sem recodificar:

```bash
ffmpeg -i out/ecopulse-main.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 320k -movflags +faststart out/ecopulse-youtube.mp4
```

(Na versão entregue foi feito em duas passadas do `loudnorm`, medindo antes e aplicando com `linear=true`.)

> Se gravar uma tela nova: copie para `public/videos/`, rode `npm run normalize-videos` e amplie para 1536×864 com o comando acima antes de renderizar.
