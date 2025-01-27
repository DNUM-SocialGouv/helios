import { useState } from "react";

import "@gouvfr/dsfr/dist/component/alert/alert.min.css";
import { SelectedRows, Table } from "../commun/Table/Table";
import { RechercheViewModel } from "../home/RechercheViewModel";
import PaginationBtn from "../parametrage-utilisateurs/UsersListPage/Pagination/PaginationBtn/PaginationBtn";
import { useSearchHistory } from "../search-history/useSearchHistory";

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
    const { saveSearchHistory } = useSearchHistory();
    const lastPage = Math.ceil(data.length / PAGE_SIZE);

    const isAllSelected = data.length > 0 && selectedRows[page] && selectedRows[page].length === data.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows({ ...selectedRows, [page]: [] });
        } else {
            setSelectedRows({ ...selectedRows, [page]: data });
        }
    };

    const startDataIndex = PAGE_SIZE * (page - 1);
    const dataOnPage = data.slice(startDataIndex, startDataIndex + PAGE_SIZE);

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
                order=""
                orderBy=""
                page={page}
                selectedRows={selectedRows}
                setOrder={() => { }}
                setOrderBy={() => { }}
                setSelectedRows={setSelectedRows} />
            {data.length > PAGE_SIZE &&
                <div>
                    <PaginationBtn paginationData={{ lastPage, page, setPage }} />
                </div>
            }
        </>
    );
};
