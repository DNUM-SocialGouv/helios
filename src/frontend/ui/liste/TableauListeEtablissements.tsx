import { useState } from "react";

import "@gouvfr/dsfr/dist/component/alert/alert.min.css";
import { SelectedRows, Table } from "../commun/Table/Table";
import { RechercheViewModel } from "../home/RechercheViewModel";
import PaginationBtn from "../parametrage-utilisateurs/UsersListPage/Pagination/PaginationBtn/PaginationBtn";
import { useSearchHistory } from "../search-history/useSearchHistory";
import { useTableauListEtablissement } from "./useTableauListEtablissement";

const PAGE_SIZE = 20;

const tableHeaders = [
    { label: "", key: "etsLogo", orderBy: "type", sort: true },
    { label: "Raison Sociale", key: "socialReason", orderBy: "raison_sociale_courte", sort: true },
    { label: "Commune", key: "commune", sort: true },
    { label: "Département", key: "departement", sort: true },
    { label: "Finess", key: "numéroFiness", orderBy: "numero_finess", sort: true },
    { label: "Rattachement(s)", key: "rattachement", orderBy: "rattachement", sort: true },
];

type TableauListeEtablissementsProps = Readonly<{
    data: RechercheViewModel[];
}>;

export const TableauListeEtablissements = ({ data }: TableauListeEtablissementsProps) => {
    const [selectedRows, setSelectedRows] = useState<SelectedRows>({ 1: [] });
    const [page, setPage] = useState(1);
    const startDataIndex = PAGE_SIZE * (page - 1);
    const [dataOnPage, setDataOnPage] = useState(data.slice(startDataIndex, startDataIndex + PAGE_SIZE))
    const [order, setOrder] = useState("ASC");
    const [orderBy, setOrderBy] = useState("numero_finess");
    let nextOrderBy = orderBy;
    const { saveSearchHistory } = useSearchHistory();
    const lastPage = Math.ceil(data.length / PAGE_SIZE);
    const { getSortFunction, sortByDefault, defaultOrder, defaultOrderBy } = useTableauListEtablissement();

    const isAllSelected = data.length > 0 && selectedRows[page] && selectedRows[page].length === data.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows({ ...selectedRows, [page]: [] });
        } else {
            setSelectedRows({ ...selectedRows, [page]: data });
        }
    };

    const onOrderByChange = (newOrderBy: string) => {
        // Le setOrderBy n’est pris en compte qu’a la prochaine execution
        // La valeur est donc stockée dans une variable pour être utilisée immediatement par onOrderChange
        nextOrderBy = newOrderBy;
        setOrderBy(newOrderBy);
    }

    const onOrderChange = (newOrder: string) => {
        // Si il n'y a pas d'ordre passé on passe au tri par defaut
        if (newOrder.trim()) {
            const sortFunction = getSortFunction(newOrder, nextOrderBy);
            data.sort(sortFunction);
            setDataOnPage(data.slice(startDataIndex, startDataIndex + PAGE_SIZE));
            setOrder(newOrder);
        } else {
            data.sort(sortByDefault);
            setDataOnPage(data.slice(startDataIndex, startDataIndex + PAGE_SIZE));
            setOrderBy(defaultOrderBy);
            setOrder(defaultOrder);
        }
    }

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        const startDataIndex = PAGE_SIZE * (newPage - 1);
        setDataOnPage(data.slice(startDataIndex, startDataIndex + PAGE_SIZE));
    }

    return (
        <>
            <Table
                data={dataOnPage}
                handleSelectAll={handleSelectAll}
                headers={tableHeaders}
                isAllSelected={isAllSelected}
                isCenter={false}
                isShowAvrage={false}
                onClickDelete={() => { }}
                onClickSocialReason={saveSearchHistory}
                order={order}
                orderBy={orderBy}
                page={page}
                selectedRows={selectedRows}
                setOrder={onOrderChange}
                setOrderBy={onOrderByChange}
                setSelectedRows={setSelectedRows} />
            {data.length > PAGE_SIZE &&
                <div>
                    <PaginationBtn paginationData={{ lastPage, page, setPage: onPageChange }} />
                </div>
            }
        </>
    );
};