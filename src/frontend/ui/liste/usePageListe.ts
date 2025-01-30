export enum Order {
    ASC = "ASC",
    DESC = "DESC"
}

export enum OrderBy {
    TYPE = "type",
    RAISON_SOCIALE = "raison_sociale_courte",
    COMMUNE = "commune",
    DEPARTEMENT = "departement",
    NUMERO_FINESS = "numero_finess",
    RATTACHEMENT = "rattachement",
    DATE_CREATION = "dateCreation"
}

export const defaultOrder = Order.DESC.valueOf();
export const defaultOrderBy = OrderBy.DATE_CREATION.valueOf();