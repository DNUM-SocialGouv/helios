import { useEffect, useState } from 'react';

import { SelectedRows, Table } from '../commun/Table/Table';
import { RechercheViewModel } from '../home/RechercheViewModel';
import { TableFooter } from '../recherche-avancee/resultat-recherche-avancee/resultat-recherche-avancee-footer/TableFooter';

const PAGE_SIZE = 20;

const tableHeaders = [
    { label: "", nomComplet: "", key: "etsLogo", orderBy: "type", sort: true },
    { label: "", nomComplet: "", key: "favori" },
    { label: "Raison Sociale", nomComplet: "", key: "socialReason", orderBy: "raison_sociale_courte", sort: true },
    { label: "Commune", nomComplet: "", key: "commune", sort: true },
    { label: "Département", nomComplet: "", key: "departement", sort: true },
    { label: "N° FINESS", nomComplet: "", key: "numéroFiness", orderBy: "numero_finess", sort: true },
    { label: "Rattachement(s)", nomComplet: "", key: "rattachement", orderBy: "rattachement", sort: true },
];

type TableauListeEtablissementsProps = Readonly<{
    terme: string;
    résultats: RechercheViewModel[];
    selectedRows: SelectedRows;
    setSelectedRows: React.Dispatch<React.SetStateAction<SelectedRows>>;
    rechercher: (terme: string, page: number, order?: string, orderBy?: string, displayTable?: boolean) => void;
    displayTable: boolean;
    nombreRésultats: number;
}>;

export const TableauEtablissements = ({ terme, résultats, rechercher, selectedRows, setSelectedRows, displayTable, nombreRésultats }: TableauListeEtablissementsProps) => {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const lastPage = Math.ceil(nombreRésultats / PAGE_SIZE);

    const isAllSelected = résultats.length > 0 && selectedRows[page] && selectedRows[page].length === résultats.length;

    useEffect(() => {
        rechercher(terme, page, order, orderBy, displayTable);
    }, [terme, page, order, orderBy])


    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows({ ...selectedRows, [page]: [] });
        } else {
            setSelectedRows({ ...selectedRows, [page]: résultats });
        }
    };

    return (
        <>
            <Table
                data={résultats}
                handleSelectAll={handleSelectAll}
                headers={tableHeaders}
                isAllSelected={isAllSelected}
                isCenter={false}
                isShowAvrage={false}
                isSimpleSearchTable={true}
                isVScroll={false}
                onClickDelete={() => { }}
                order={order}
                orderBy={orderBy}
                page={page}
                selectedRows={selectedRows}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                setSelectedRows={setSelectedRows}
            />
            <TableFooter lastPage={lastPage} nombreDeResultatsMaxParPage={PAGE_SIZE} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage} />
        </>
    );
};