import { useRouter } from "next/router";

type TableHeaderRechercheAvanceeProps = Readonly<{
    selectedRows: number[];
}>

export const TableHeaderRechercheAvancee = ({ selectedRows }: TableHeaderRechercheAvanceeProps)  => {
    const router = useRouter();
    return (
        <div className="fr-table__header">
                <p className="fr-table__detail">Nombre de lignes sélectionnées : {selectedRows?.length}</p>
                <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-md fr-btns-group--icon-left">
                    <li>
                        <button
                            className="fr-btn fr-btn--icon-left fr-btn--secondary"
                            disabled={selectedRows.length < 2}
                            id="table-header-button-primary-7842"
                            onClick={() => router.push("/comparaison")}
                        >
                            Comparer
                        </button>
                    </li>
                </ul>
        </div>
    )
}