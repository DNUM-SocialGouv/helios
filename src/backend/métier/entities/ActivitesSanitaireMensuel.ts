export type ActivitesSanitaireMensuel = Readonly<{
    dateDeMiseAJour: string;
    activitesSanitaireMensuelList: ActiviteSanitaireMensuel[];
}>;

export type ActiviteSanitaireMensuel = Readonly<{
    année: number;
    mois: number;
    nombreJournéesPartiellesSsr: number;
    nombreJournéesCompletesSsr: number;
    nombreSéjoursCompletsChirurgie: number;
    nombreSéjoursCompletsMédecine: number;
    nombreSéjoursCompletsObstétrique: number;
    nombreSéjoursPartielsChirurgie: number;
    nombreSéjoursPartielsMédecine: number;
    nombreSéjoursPartielsObstétrique: number;
}>;
