export type ActivitesSanitaireMensuel = Readonly<{
  dateDeMiseAJour: string;
  activitesSanitaireMensuelList: ActiviteSanitaireMensuel[];
}>;

export type ActiviteSanitaireMensuel = Readonly<{
  année: number;
  mois: number;
  nombreJournéesPartiellesSsr: number | null;
  nombreJournéesCompletesSsr: number | null;
  nombreSéjoursCompletsChirurgie: number | null;
  nombreSéjoursCompletsMédecine: number | null;
  nombreSéjoursCompletsObstétrique: number | null;
  nombreSéjoursPartielsChirurgie: number | null;
  nombreSéjoursPartielsMédecine: number | null;
  nombreSéjoursPartielsObstétrique: number | null;
  nombreJournéesComplètesPsy: number | null;
  nombreJournéesPartiellesPsy: number | null;
}>;
