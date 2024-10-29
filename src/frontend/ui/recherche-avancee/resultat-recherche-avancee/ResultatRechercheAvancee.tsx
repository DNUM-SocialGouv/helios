import { useContext, useState } from "react";

import "@gouvfr/dsfr/dist/component/segmented/segmented.min.css";
import { Table } from "../../commun/Table/Table";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { TableFooterRechercheAvancee } from "./resultat-recherche-avancee-footer/RechercheAvanceeFooter";
import { TableHeaderRechercheAvancee } from "./TableHeaderRechercheAvancee";
import { RechercheAvanceeContext } from "../../commun/contexts/RechercheAvanceeContext";

const tableHeaders = [
    { label: "", key: "etsLogo", sort: true },
    { label: "", key: "favori" },
    { label: "Raison Sociale", key: "raison_sociale_courte", sort: true },
    { label: "Commune", key: "commune", sort: true },
    { label: "Département", key: "departement", sort: true },
    { label: "Finess ET", key: "numero_finess", sort: true },
    { label: "Type", key: "type", sort: true }
];

type ResultatRechercheAvanceeProps = Readonly<{
    data: RechercheViewModel[]
    nombreRésultats: number
    setPage: ((page: number) => void) | undefined
    lastPage: number
    page: number | undefined
}>;

export const ResultatRechercheAvancee = ({ data, nombreRésultats, page, setPage, lastPage }: ResultatRechercheAvanceeProps) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

    return (
        <>
            <TableHeaderRechercheAvancee selectedRows={selectedRows} />
            <Table
                data={data}
                headers={tableHeaders}
                order={rechercheAvanceeContext?.order || ""}
                orderBy={rechercheAvanceeContext?.orderBy || ""}
                selectedRows={selectedRows}
                setOrder={rechercheAvanceeContext?.setOrder || (() => {})}
                setOrderBy={rechercheAvanceeContext?.setOrderBy || (() => {})}
                setSelectedRows={setSelectedRows} />
            <TableFooterRechercheAvancee lastPage={lastPage} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => { })} />
        </>
    )
};
