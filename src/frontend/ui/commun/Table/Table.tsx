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

export const Table = ({ headers, data = [], selectedRows = [], setSelectedRows }: DataTableProps) => {
    const isAllSelected = data.length > 0 && selectedRows.length === data.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.map((_, index) => index));
        }
    };

    const handleSelectRow = (rowIndex: number) => {
        if (selectedRows.includes(rowIndex)) {
            setSelectedRows(selectedRows.filter(index => index !== rowIndex));
        } else {
            setSelectedRows([...selectedRows, rowIndex]);
        }
    };

    return (
        <div className="fr-table" id="table-selectable-component">
            <div className="fr-table__wrapper">
                <div className="fr-table__container">
                    <div className="fr-table__content">
                        <table id="table-selectable">
                            <thead>
                                <tr>
                                    <th className="fr-cell--fixed" role="columnheader">
                                        <div className="fr-checkbox-group fr-checkbox-group--sm">
                                            <input
                                                checked={isAllSelected}
                                                id="table-select-checkbox-7748--0"
                                                name="row-select"
                                                onChange={handleSelectAll}
                                                type="checkbox"
                                            />
                                            <label className="fr-label" htmlFor="table-select-checkbox-7748--0">
                                                Sélectionner tous les lignes
                                            </label>
                                        </div>
                                    </th>
                                    {headers.map((header, index) => header.sort ? (
                                        <th key={index}>
                                            <span className="fr-cell__title">{header.label}</span>
                                            <button className="fr-btn--sort fr-btn fr-btn--sm fr-mx-1w" id="table-miscellaneous-thead-sort-asc-desc" >Trier</button>
                                        </th>
                                    ) : (
                                        <th className={styles["logo-center"]} key={index}>
                                            <span>{header.label}</span>
                                            {header.key !== "delete" && <span className={"fr-fi-information-line fr-mx-1w " + styles["info-container"]} />}
                                        </th>
                                    )
                                    )}
                                </tr>
                            </thead>
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
                                            <td className={header.key === "favori" ? "fr-cell--center" : ""} key={colIndex}>
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
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
