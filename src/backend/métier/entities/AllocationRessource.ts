export type AllocationRessourceDetails = {
    enveloppe: string,
    sousEnveloppe: string,
    modeDeDélégation: string,
    montantNotifié: number,
}

export type AllocationRessourceData = {
    année: number,
    allocationRessoure: AllocationRessourceDetails[]
}

export type AllocationRessource = {
    dateMiseÀJourSource: string,
    data: AllocationRessourceData[]
}

