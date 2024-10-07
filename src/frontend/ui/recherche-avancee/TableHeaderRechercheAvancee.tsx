import { useRouter } from "next/router";

type TableHeaderRechercheAvanceeProps = Readonly<{
    selectedRows: number[];
}>

export const TableHeaderRechercheAvancee = ({ selectedRows }: TableHeaderRechercheAvanceeProps)  => {
    const router = useRouter();
    return (
        <div className="fr-table__header">
                <fieldset className="fr-segmented fr-segmented--no-legend">
                    <legend className="fr-segmented__legend">
                        Vue
                    </legend>
                    <div className="fr-segmented__elements">
                        {/* <div className="fr-segmented__element">
                            <input defaultChecked id="table-header-segmented-table-7845" name="table-header-segmented-table" type="radio" value="1" />
                            <label className="fr-icon-table-line fr-label" htmlFor="table-header-segmented-table-7845">
                                Tableau
                            </label>
                        </div> */}
                        {/* <div className="fr-segmented__element">
                            <input id="table-header-segmented-list-7846" name="table-header-segmented-table" type="radio" value="2" />
                            <label className="fr-icon-layout-grid-line fr-label" htmlFor="table-header-segmented-list-7846">
                                Vignette
                            </label>
                        </div> */}
                    </div>
                </fieldset>
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
                    {/* <li>
                        <button className="fr-btn fr-btn--secondary" id="table-header-button-secondary-7843">Exporter</button>
                    </li> */}
                </ul>
        </div>
    )
}