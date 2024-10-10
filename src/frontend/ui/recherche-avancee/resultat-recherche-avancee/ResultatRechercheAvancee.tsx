import { useState } from "react";

import "@gouvfr/dsfr/dist/component/segmented/segmented.min.css";
import { Table } from "../../commun/Table/Table";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import PaginationBtn from "../../parametrage-utilisateurs/UsersListPage/Pagination/PaginationBtn/PaginationBtn";
import { TableHeaderRechercheAvancee } from "./TableHeaderRechercheAvancee";

const tableHeaders = [
    { label: "", key: "delete" },
    { label: "", key: "etsLogo", sort: true },
    { label: "", key: "favori", sort: true },
    { label: "Commune", key: "commune", sort: true },
    { label: "Département", key: "departement", sort: true },
    { label: "Numéro Finess", key: "numéroFiness" },
    { label: "Raison Sociale Courte", key: "socialReason" },
    { label: "Type", key: "type" }
];

type ResultatRechercheAvanceeProps = Readonly<{
    data: RechercheViewModel[]
}>;

export const ResultatRechercheAvancee = ({ data }: ResultatRechercheAvanceeProps) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const lastPage = 20;

    return (
        <>
            <TableHeaderRechercheAvancee selectedRows={selectedRows} />
            <Table data={data} headers={tableHeaders} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
            <PaginationBtn paginationData={{lastPage, page, setPage}} />
        </>
    )
};
