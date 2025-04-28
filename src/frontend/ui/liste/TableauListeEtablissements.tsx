import { useEffect, useState } from 'react';

import { useDependencies } from '../commun/contexts/useDependencies';
import Spinner from '../commun/Spinner/Spinner';
import { SelectedRows, Table } from '../commun/Table/Table';
import { AlerteComparaison } from '../comparaison/alerte-comparaison/AlerteComparaison';
import { RechercheViewModel } from '../home/RechercheViewModel';
import { TableFooter } from '../recherche-avancee/resultat-recherche-avancee/resultat-recherche-avancee-footer/TableFooter';
import { UserListViewModel } from '../user-list/UserListViewModel';
import { Order, OrderBy } from './usePageListe';

const PAGE_SIZE = 20;
const defaultOrder = Order.DESC.valueOf();
const defaultOrderBy = OrderBy.DATE_CREATION.valueOf();

const tableHeaders = [
    { label: "", nomComplet: "", key: "etsLogo", orderBy: "type", sort: true },
    { label: "Raison Sociale", nomComplet: "", key: "socialReason", orderBy: "raison_sociale_courte", sort: true },
    { label: "Commune", nomComplet: "", key: "commune", sort: true },
    { label: "Département", nomComplet: "", key: "departement", sort: true },
    { label: "N° FINESS", nomComplet: "", key: "numéroFiness", orderBy: "numero_finess", sort: true },
    { label: "Rattachement(s)", nomComplet: "", key: "rattachement", orderBy: "rattachement", sort: true },
];

type TableauListeEtablissementsProps = Readonly<{
    list: UserListViewModel;
    selectedRows: SelectedRows,
    setSelectedRows: React.Dispatch<React.SetStateAction<SelectedRows>>
    order: string
    setOrder: React.Dispatch<React.SetStateAction<string>>
    orderBy: string
    setOrderBy: React.Dispatch<React.SetStateAction<string>>
}>;

export const TableauListeEtablissements = ({ list, selectedRows, setSelectedRows, order, orderBy, setOrder, setOrderBy }: TableauListeEtablissementsProps) => {
    const { paths } = useDependencies();
    const [page, setPage] = useState(1);
    const [dataOnPage, setDataOnPage] = useState<RechercheViewModel[]>([])
    const [loading, setLoading] = useState(true);

    const etablissements = list.userListEtablissements;
    const lastPage = Math.ceil(etablissements.length / PAGE_SIZE);

    const isAllSelected = dataOnPage.length > 0 && selectedRows[page] && selectedRows[page].length === dataOnPage.length;
    const showAlert = Object.values(selectedRows).flat().length > 1;
    useEffect(() => {
        setLoading(true);
        const queryParams = new URLSearchParams({
            order: order,
            orderBy: orderBy,
            page: String(page),
            limit: String(PAGE_SIZE),
        });
        fetch(`/api/liste/${list.id}/etablissement?${queryParams.toString()}`,
            {
                headers: { "Content-Type": "application/json" },
                method: "GET",
            })
            .then((response) => response.json())
            .then((data) => {
                setDataOnPage(data.map((résultat: any) => new RechercheViewModel(résultat, paths)));
                setLoading(false);
            });
    }, [list, page, order, orderBy])

    const onOrderChange = (newOrder: string) => {
        // Si il n'y a pas d'ordre passé on passe au tri par defaut
        if (newOrder.trim()) {
            setOrder(newOrder);
        } else {
            setOrderBy(defaultOrderBy);
            setOrder(defaultOrder);
        }
    }

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows({ ...selectedRows, [page]: [] });
        } else {
            setSelectedRows({ ...selectedRows, [page]: dataOnPage });
        }
    };

    return (
        <>
            {loading
                ? <Spinner />
                : <>
                    {showAlert && <AlerteComparaison />}
                    <Table
                        data={dataOnPage}
                        handleSelectAll={handleSelectAll}
                        headers={tableHeaders}
                        isAllSelected={isAllSelected}
                        isCenter={false}
                        isShowAvrage={false}
                        isVScroll={false}
                        onClickDelete={() => { }}
                        order={order}
                        orderBy={orderBy}
                        page={page}
                        selectedRows={selectedRows}
                        setOrder={onOrderChange}
                        setOrderBy={setOrderBy}
                        setSelectedRows={setSelectedRows} />
                    <TableFooter lastPage={lastPage} nombreDeResultatsMaxParPage={PAGE_SIZE} nombreRésultats={etablissements.length} page={page || 1} setPage={setPage} />
                </>
            }
        </>
    );
};