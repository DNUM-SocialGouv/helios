
export type DataRowEntitéJuridiqueAllocationRessources = {
  enveloppe: string | null | '';
  sousEnveloppe: string | null | '';
  modeDeDélégation: string | null | '';
  montantNotifié: number | null | '';
};

export type EntitéJuridiqueAllocationRessources = {
  dateMiseÀJourSource: string;
  année: number;
  data: DataRowEntitéJuridiqueAllocationRessources[]
};

export type AllocationValeursAvecMotif = 
{ 
  motif: string,
  valeur: number 
}


// Définition du type pour ModeDeDélégation
export interface IModeDeDélégation {
  modeDeDélégation: string;
  montantNotifié: number;
  pourcentage: string;
}

// Définition du type pour SousEnveloppe
export interface ISousEnveloppe {
  sousEnveloppe: string;
  total: number;
  pourcentage: string;
  modesDeDélégation: IModeDeDélégation[];
}

// Définition du type pour Enveloppe
export interface IEnveloppe {
  enveloppe: string;
  total: number;
  pourcentage: string;
  sousEnveloppes: ISousEnveloppe[];
}
