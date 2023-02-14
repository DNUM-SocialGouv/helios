export type IndicateurDesSejoursMCO = Readonly<{
  nombreSéjoursCompletsMédecine: { x: number; y: number | null }[];
  nombreSéjoursCompletsChirurgie: { x: number; y: number | null }[];
  nombreSéjoursCompletsObstétrique: { x: number; y: number | null }[];
  nombreSéjoursPartielsMédecine: { x: number; y: number | null }[];
  nombreSéjoursPartielsChirurgie: { x: number; y: number | null }[];
  nombreSéjoursPartielsObstétrique: { x: number; y: number | null }[];
}>;
