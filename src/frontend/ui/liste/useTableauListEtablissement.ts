import { TableauListEtalblissementViewModel } from "./TableauListEtablissementViewModel";

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

const sortOptions: Intl.CollatorOptions = { numeric: true };
const sortByTypeAsc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab1.recherche.type.localeCompare(etab2.recherche.type, undefined, sortOptions);
const sortByTypeDesc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab2.recherche.type.localeCompare(etab1.recherche.type, undefined, sortOptions);
const sortByRaisonSocialeAsc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab1.recherche.socialReason.localeCompare(etab2.recherche.socialReason, undefined, sortOptions);
const sortByRaisonSocialeDesc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab2.recherche.socialReason.localeCompare(etab1.recherche.socialReason, undefined, sortOptions);
const sortByCommuneAsc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab1.recherche.commune.localeCompare(etab2.recherche.commune, undefined, sortOptions);
const sortByCommuneDesc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab2.recherche.commune.localeCompare(etab1.recherche.commune, undefined, sortOptions);
const sortByDepartementAsc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab1.recherche.departement.localeCompare(etab2.recherche.departement, undefined, sortOptions);
const sortByDepartementDesc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab2.recherche.departement.localeCompare(etab1.recherche.departement, undefined, sortOptions);
const sortByFinessAsc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab1.recherche.numéroFiness.localeCompare(etab2.recherche.numéroFiness, undefined, sortOptions);
const sortByFinessDesc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab2.recherche.numéroFiness.localeCompare(etab1.recherche.numéroFiness, undefined, sortOptions);
const sortByRattachementAsc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab1.recherche.rattachement.localeCompare(etab2.recherche.rattachement, undefined, sortOptions);
const sortByRattachementDesc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) => etab2.recherche.rattachement.localeCompare(etab1.recherche.rattachement, undefined, sortOptions);
const sortByDateCreationDesc = (etab1: TableauListEtalblissementViewModel, etab2: TableauListEtalblissementViewModel) =>  new Date(etab2.dateCreation).getTime() - new Date(etab1.dateCreation).getTime()


const defaultOrder = Order.DESC.valueOf();
const defaultOrderBy = OrderBy.DATE_CREATION.valueOf();
const sortByDefault = sortByDateCreationDesc;

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