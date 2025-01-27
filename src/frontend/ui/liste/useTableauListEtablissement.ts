import { RechercheViewModel } from "../home/RechercheViewModel";

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
    RATTACHEMENT = "rattachement"
}

const sortOptions: Intl.CollatorOptions = { numeric: true };
const sortByTypeAsc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab1.type.localeCompare(etab2.type, undefined, sortOptions);
const sortByTypeDesc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab2.type.localeCompare(etab1.type, undefined, sortOptions);
const sortByRaisonSocialeAsc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab1.socialReason.localeCompare(etab2.socialReason, undefined, sortOptions);
const sortByRaisonSocialeDesc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab2.socialReason.localeCompare(etab1.socialReason, undefined, sortOptions);
const sortByCommuneAsc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab1.commune.localeCompare(etab2.commune, undefined, sortOptions);
const sortByCommuneDesc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab2.commune.localeCompare(etab1.commune, undefined, sortOptions);
const sortByDepartementAsc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab1.departement.localeCompare(etab2.departement, undefined, sortOptions);
const sortByDepartementDesc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab2.departement.localeCompare(etab1.departement, undefined, sortOptions);
const sortByFinessAsc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab1.numéroFiness.localeCompare(etab2.numéroFiness, undefined, sortOptions);
const sortByFinessDesc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab2.numéroFiness.localeCompare(etab1.numéroFiness, undefined, sortOptions);
const sortByRattachementAsc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab1.rattachement.localeCompare(etab2.rattachement, undefined, sortOptions);
const sortByRattachementDesc = (etab1: RechercheViewModel, etab2: RechercheViewModel) => etab2.rattachement.localeCompare(etab1.rattachement, undefined, sortOptions);

const defaultOrder = Order.ASC.valueOf();
const defaultOrderBy = OrderBy.NUMERO_FINESS.valueOf();
const sortByDefault = sortByFinessAsc;

export function useTableauListEtablissement() {

    function getSortFunction(order: string, orderBy: string) {
        switch (orderBy) {
            case OrderBy.COMMUNE: {
                return order === Order.ASC ? sortByCommuneAsc : sortByCommuneDesc;
            }
            case OrderBy.DEPARTEMENT: {
                return order === Order.ASC ? sortByDepartementAsc : sortByDepartementDesc;
            }
            case OrderBy.NUMERO_FINESS: {
                return order === Order.ASC ? sortByFinessAsc : sortByFinessDesc;
            }
            case OrderBy.RAISON_SOCIALE: {
                return order === Order.ASC ? sortByRaisonSocialeAsc : sortByRaisonSocialeDesc;
            }
            case OrderBy.TYPE: {
                return order === Order.ASC ? sortByTypeAsc : sortByTypeDesc;
            }
            case OrderBy.RATTACHEMENT: {
                return order === Order.ASC ? sortByRattachementAsc : sortByRattachementDesc;
            }
            default: { return sortByDefault; }
        }
    }
    return { getSortFunction, sortByDefault, defaultOrder, defaultOrderBy, };
}