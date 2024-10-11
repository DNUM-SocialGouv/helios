import { Dispatch, SetStateAction } from "react";

import { LogoÉtablissementTerritorial } from "../../établissement-territorial-médico-social/logo-établissement-territorial-médico-social";
import styles from "./Table.module.css";

interface Header {
    label: string;
    key: string;
    isButton?: boolean;
    sort?: boolean;
}

interface DataTableProps {
    headers: Header[];
    data: Record<string, any>[];
    onButtonClick?: (rowIndex: number, colIndex: number) => void;
    selectedRows: number[]
    setSelectedRows: Dispatch<SetStateAction<number[]>>
}

interface TableHeaderProps {
    headers: Header[];
}

interface TableBodyProps {
    headers: Header[];
    selectedRows: number[]
    data: Record<string, any>[];
    handleSelectRow: (index: number) => void
}

const TableHeader = ({ headers }: TableHeaderProps) => {
    return (
        <thead>
            <tr>
                <th className="fr-cell--fixed" role="columnheader">
                    <span className="fr-sr-only">Sélectionner</span>
                </th>
                {headers.map((header, index) => header.sort ? (
                    <th className={["etsLogo", "favori"].includes(header.key) ? styles["header-logo"] : ""} key={index}>
                        <span className="fr-cell__title">{header.label}</span>
                        <button className="fr-btn--sort fr-btn fr-btn--sm fr-mx-1w" id="table-miscellaneous-thead-sort-asc-desc" >Trier</button>
                    </th>
                ) : (
                    <th key={index}>
                        <span>{header.label}</span>
                        {header.key !== "delete" && <span className={"fr-fi-information-line fr-mx-1w " + styles["info-container"]} />}
                    </th>
                )
                )}
            </tr>
        </thead>
    )
}

const TableBody = ({ headers, data, selectedRows, handleSelectRow }: TableBodyProps) => {
    return (
        <tbody>
            {data.map((row, rowIndex) => (
                <tr data-row-key={rowIndex} id={`table-selectable-row-key-${rowIndex}`} key={rowIndex}>
                    <th className="fr-cell--fixed" scope="row">
                        <div className="fr-checkbox-group fr-checkbox-group--sm">
                            <input
                                checked={selectedRows.includes(rowIndex)}
                                id={`table-select-checkbox-7748--${rowIndex}`}
                                name="row-select"
                                onChange={() => handleSelectRow(rowIndex)}
                                type="checkbox" />
                            <label className="fr-label" htmlFor={`table-select-checkbox-7748--${rowIndex}`}>
                                Séléction {rowIndex}
                            </label>
                        </div>
                    </th>
                    {headers.map((header, colIndex) => (
                        <td className={header.key === "favori" ? "fr-cell--center" : styles["cell-container"]} key={colIndex}>
                            {header.key === "delete" && (
                                <button aria-controls="fr-modal-2" className="fr-icon-delete-line fr-cell--center" data-fr-opened="false" title="Supprimer" type="button" />
                            )}
                            {header.key === "etsLogo" && (
                                <div className={styles["logo-center"]}>
                                    <span className={styles["logo-container"]}>{LogoÉtablissementTerritorial}</span>
                                </div>
                            )}
                            {header.key === "favori" && (
                                <button className={"fr-icon-star-line .fr-icon--lg " + styles["star"]} />
                            )}
                            {row[header.key]}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

export const Table = ({ headers, data = [], selectedRows = [], setSelectedRows }: DataTableProps) => {
    const handleSelectRow = (rowIndex: number) => {
        if (selectedRows.includes(rowIndex)) {
            setSelectedRows(selectedRows.filter(index => index !== rowIndex));
        } else {
            setSelectedRows([...selectedRows, rowIndex]);
        }
    };

    return (
        <div id="table-selectable-component">
            <div className="fr-table__wrapper">
                <div className="fr-table__container">
                    <div className="fr-table__content">
                        <table id="table-selectable">
                            <TableHeader headers={headers} />
                            <TableBody data={data} handleSelectRow={handleSelectRow} headers={headers} selectedRows={selectedRows} />
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
