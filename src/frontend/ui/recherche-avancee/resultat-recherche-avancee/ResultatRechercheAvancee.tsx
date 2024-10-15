"use client"

import { useState } from "react";

import "@gouvfr/dsfr/dist/component/segmented/segmented.min.css";
import { Table } from "../../commun/Table/Table";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { TableFooterRechercheAvancee } from "./resultat-recherche-avancee-footer/RechercheAvanceeFooter";
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
    nombreRésultats: number
    setPage: (page: number) => void
    lastPage: number
    page: number
}>;

export const ResultatRechercheAvancee = ({ data, nombreRésultats, page, setPage, lastPage }: ResultatRechercheAvanceeProps) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    return (
        <>
            <TableHeaderRechercheAvancee selectedRows={selectedRows} />
            <Table data={data} headers={tableHeaders} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
            <TableFooterRechercheAvancee lastPage={lastPage} nombreRésultats={nombreRésultats} page={page} setPage={setPage} />
        </>
    )
};