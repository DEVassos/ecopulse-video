/**
 * EcoPulse - Constantes de layout
 *
 * Todas as telas do app foram capturadas em 1366x768 (16:9). O <BrowserFrame>
 * mantém a área de conteúdo rígida em 16:9, então nada é cortado nem esticado.
 * As larguras abaixo foram escolhidas múltiplas de 16 para que a altura
 * resultante caia em pixel inteiro.
 */

/** Largura de conteúdo das cenas de tela cheia (altura = 864). */
export const FULL_SCREEN_WIDTH = 1536;

/** Vão central onde fica o conector animado da Cena 4. */
export const SPLIT_GAP = 80;

/** Largura de cada painel da Cena 4 (altura = 477). */
export const SPLIT_PANEL_WIDTH = 848;

/** Largura total ocupada pela cena split-screen. */
export const SPLIT_CONTENT_WIDTH = SPLIT_PANEL_WIDTH * 2 + SPLIT_GAP;

/** Altura da barra de título do <BrowserFrame>. */
export const BROWSER_HEADER_HEIGHT = 44;

/** Altura total do frame em tela cheia (conteúdo 16:9 + barra). */
export const FULL_SCREEN_FRAME_HEIGHT =
  (FULL_SCREEN_WIDTH * 9) / 16 + BROWSER_HEADER_HEIGHT;

/** Altura total de cada painel da Cena 4. */
export const SPLIT_FRAME_HEIGHT =
  (SPLIT_PANEL_WIDTH * 9) / 16 + BROWSER_HEADER_HEIGHT;
