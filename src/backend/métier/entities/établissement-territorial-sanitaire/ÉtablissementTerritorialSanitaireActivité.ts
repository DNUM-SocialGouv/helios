export type ÉtablissementTerritorialSanitaireActivité = Readonly<{
  année: number;
  nombreDePassagesAuxUrgences: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreJournéesCompletePsy: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreJournéesCompletesSsr: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreJournéesPartiellesPsy: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreJournéesPartielsSsr: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreSéjoursCompletsChirurgie: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreSéjoursCompletsMédecine: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreSéjoursCompletsObstétrique: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreSéjoursPartielsChirurgie: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreSéjoursPartielsMédecine: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  nombreSéjoursPartielsObstétrique: {
    dateMiseÀJourSource: string;
    value: number | null;
  };
  numéroFinessÉtablissementTerritorial: string;
}>;
