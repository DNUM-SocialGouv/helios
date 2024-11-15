/* eslint-disable jsx-a11y/aria-props */
import { Dispatch, SetStateAction } from "react";

import { LogoEntitéJuridique } from "../../entité-juridique/bloc-activité/LogoEntitéJuridique";
import { ComparaisonViewModel, MoyenneResultatComparaison } from "../../home/ComparaisonViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { LogoÉtablissementTerritorial } from "../../établissement-territorial-médico-social/logo-établissement-territorial-médico-social";
import { LogoÉtablissementTerritorial as LogoÉtablissementTerritorialSanitaire } from "../../établissement-territorial-sanitaire/logo-établissement-territorial-sanitaire";
import { StarButton } from "../StarButton/StarButton";
import styles from "./Table.module.css";
import { TableExtensionCalculMoyenne } from "./TableExtensionCalculMoyenne";

interface Header {
  label: string;
  key: string;
  isButton?: boolean;
  sort?: boolean;
  orderBy?: string;
}

interface DataTableProps {
  headers: Header[];
  data: RechercheViewModel[] | ComparaisonViewModel[];
  forMoyenne: MoyenneResultatComparaison;
  onButtonClick?: (rowIndex: number, colIndex: number) => void;
  selectedRows: number[];
  setSelectedRows: Dispatch<SetStateAction<number[]>>;
  order: string;
  orderBy: string;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  isShowAvrage: boolean;
  onClickInfobull?: (name: string) => void;
}

interface TableHeaderProps {
  headers: Header[];
  order: string;
  orderBy: string;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  onClickInfobull?: (name: string) => void;
}

interface TableBodyProps {
  headers: Header[];
  selectedRows: any[];
  data: RechercheViewModel[] | ComparaisonViewModel[];
  forMoyenne: MoyenneResultatComparaison;
  handleSelectRow: (valeurs: any) => void;
  isShowAvrage: boolean;
}

interface TriProps {
  order: string;
  orderBy: string;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  headerKey: string;
}

const Tri = ({ order, orderBy, headerKey, setOrderBy, setOrder }: TriProps) => {
  if (order === "ASC" && headerKey === orderBy) {
    return (
      <button
        aria-sorting="asc"
        className="fr-btn--sort fr-btn fr-btn--sm fr-mx-1w"
        id="table-miscellaneous-thead-sort-asc"
        onClick={() => {
          setOrderBy(headerKey);
          setOrder("DESC");
        }}
      >
        Trier
      </button>
    );
  } else if (order === "DESC" && headerKey === orderBy) {
    return (
      <button
        aria-sorting="desc"
        className="fr-btn--sort fr-btn fr-btn--sm fr-mx-1w"
        id="table-miscellaneous-thead-sort-desc"
        onClick={() => {
          setOrderBy(headerKey);
          setOrder("");
        }}
      >
        Trier
      </button>
    );
  } else
    return (
      <button
        className="fr-btn--sort fr-btn fr-btn--sm fr-mx-1w"
        id="table-miscellaneous-thead-sort-asc-desc"
        onClick={() => {
          setOrderBy(headerKey);
          setOrder("ASC");
        }}
      >
        Trier
      </button>
    );
};

const construisLeLien = (type: string, finess: string): string => {
  if (type === "Médico-social") {
    return "/etablissement-territorial-medico-social/" + finess;
  } else if (type === "Sanitaire") {
    return "/etablissement-territorial-sanitaire/" + finess;
  }
  return "/entite-juridique/" + finess;
}

const TableHeader = ({ headers, order, orderBy, setOrderBy, setOrder, onClickInfobull }: TableHeaderProps) => {
  return (
    <thead>
      <tr>
        <th className="fr-cell--fixed" role="columnheader">
          <span className="fr-sr-only">Sélectionner</span>
        </th>
        {headers.map((header, index) =>
          header.sort ? (
            <th className={["etsLogo", "favori"].includes(header.key) ? styles["header-logo"] : ""} key={index}>
              <span className="fr-cell__title">{header.label}</span>
              <Tri headerKey={header.orderBy || header.key} order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} />
            </th>
          ) : (
            <th key={index}>
              <span>{header.label}</span>
              {header.key !== "delete" && onClickInfobull && (
                <button className={"fr-fi-information-line fr-mx-1w " + styles["info-container"]} onClick={() => onClickInfobull(header.key)} />
              )}
            </th>
          )
        )}
      </tr>
    </thead>
  );
};


const TableBody = ({ headers, data, forMoyenne, selectedRows, handleSelectRow, isShowAvrage }: TableBodyProps) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr data-row-key={rowIndex} id={`table-selectable-row-key-${rowIndex}`} key={rowIndex}>
          <th className="fr-cell--fixed" scope="row">
            <div className="fr-checkbox-group fr-checkbox-group--sm">
              <input
                checked={selectedRows.includes(row)}
                id={`table-select-checkbox-7748--${rowIndex}`}
                name="row-select"
                onChange={() => handleSelectRow(row)}
                type="checkbox"
              />
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
                  {row["type"] === "Sanitaire" && <span className={styles["logo-container"]}>{LogoÉtablissementTerritorialSanitaire}</span>}
                  {row["type"] === "Médico-social" && <span className={styles["logo-container"]}>{LogoÉtablissementTerritorial}</span>}
                  {row["type"] === "Entité juridique" && <span className={styles["logo-container"]}>{LogoEntitéJuridique}</span>}
                </div>
              )}
              {header.key === "favori" && <StarButton favorite={row as RechercheViewModel} parent="tab" />}
              {header.key === "socialReason" && (
                <a className="fr-tile__link" href={construisLeLien(row["type"], row["numéroFiness"])} style={{ backgroundImage: "none" }}>
                  {row[header.key]}
                </a>
              )}
              {header.key !== "socialReason" && (row as any)[header.key] !== null ? (row as any)[header.key] : header.key !== "socialReason" && "-"}
            </td>
          ))}
        </tr>
      ))}
      {isShowAvrage && data.length > 0 && <TableExtensionCalculMoyenne dataSource={forMoyenne} />}
    </tbody>
  );
};

export const Table = ({
  headers,
  data = [],
  forMoyenne,
  selectedRows = [],
  setSelectedRows,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  isShowAvrage = false,
  onClickInfobull,
}: DataTableProps) => {
  const handleSelectRow = (rowIndex: any) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((index) => index !== rowIndex));
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
              <TableHeader headers={headers} onClickInfobull={onClickInfobull} order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} />
              <TableBody
                data={data}
                forMoyenne={forMoyenne}
                handleSelectRow={handleSelectRow}
                headers={headers}
                isShowAvrage={isShowAvrage}
                selectedRows={selectedRows}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
