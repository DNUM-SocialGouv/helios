/* eslint-disable jsx-a11y/aria-props */
import { Dispatch, SetStateAction } from "react";

import { LogoEntitéJuridique } from "../../entité-juridique/bloc-activité/LogoEntitéJuridique";
import { ComparaisonViewModel, MoyenneResultatComparaison } from "../../home/ComparaisonViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { SelectedRows } from "../../recherche-avancee/resultat-recherche-avancee/ResultatRechercheAvancee";
import { LogoÉtablissementTerritorial } from "../../établissement-territorial-médico-social/logo-établissement-territorial-médico-social";
import { LogoÉtablissementTerritorial as LogoÉtablissementTerritorialSanitaire } from "../../établissement-territorial-sanitaire/logo-établissement-territorial-sanitaire";
import { StarButtonList } from "../StarButtonList/StarButtonList";
import styles from "./Table.module.css";
import { TableExtensionCalculMoyenne } from "./TableExtensionCalculMoyenne";

interface Header {
  label: string;
  key: string;
  isButton?: boolean;
  sort?: boolean;
  info?: boolean;
  orderBy?: string;
}

interface DataTableProps {
  headers: Header[];
  data: RechercheViewModel[] | ComparaisonViewModel[];
  forMoyenne?: MoyenneResultatComparaison;
  total?: number;
  onButtonClick?: (rowIndex: number, colIndex: number) => void;
  selectedRows: SelectedRows;
  setSelectedRows: Dispatch<SetStateAction<Readonly<SelectedRows>>>;
  order: string;
  orderBy: string;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  isShowAvrage: boolean;
  isCenter: boolean;
  onClickInfobull?: (name: string) => void;
  page: number;
  handleSelectAll: () => void;
  isAllSelected: boolean;
  onClickDelete: (finessNumber: string) => void;
  handleInfoBullMoyenne?: Dispatch<SetStateAction<boolean>>;
  onClickSocialReason: (title: string, finessNumber: string, type: string) => void;
}

interface TableHeaderProps {
  headers: Header[];
  order: string;
  orderBy: string;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  onClickInfobull?: (name: string) => void;
  handleSelectAll: () => void;
  isAllSelected: boolean;
  isCenter: boolean;
  page: number;
}

interface TableBodyProps {
  headers: Header[];
  selectedRows: SelectedRows;
  data: RechercheViewModel[] | ComparaisonViewModel[];
  forMoyenne?: MoyenneResultatComparaison;
  total?: number;
  handleSelectRow: (valeurs: any) => void;
  isShowAvrage: boolean;
  isCenter: boolean;
  page: number;
  onClickDelete: (finessNumber: string) => void;
  handleInfoBullMoyenne?: Dispatch<SetStateAction<boolean>>;
  onClickSocialReason: (title: string, finessNumber: string, type: string) => void;
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
};

const TableHeader = ({ headers, order, orderBy, setOrderBy, setOrder, onClickInfobull, handleSelectAll, isAllSelected, isCenter }: TableHeaderProps) => {
  return (
    <thead>
      <tr className={styles["sticky-header"]}>
        <th className="fr-cell--fixed" role="columnheader">
          <div className="fr-checkbox-group fr-checkbox-group--sm">
            <input checked={isAllSelected || false} id="table-select-checkbox-7748--0" name="row-select" onChange={handleSelectAll} type="checkbox" />
            <label className="fr-label" htmlFor="table-select-checkbox-7748--0">
              Séléctionner tous les éléments
            </label>
          </div>
        </th>
        {headers.map((header, index) =>
          <th className={isCenter ? "fr-cell--center" : ""} key={index}>
            <span className="fr-cell__title">{header.label}</span>
            {header.info && onClickInfobull && (
              <button
                className={"fr-fi-information-line fr-mx-1w " + styles["info-container"]}
                onClick={() => onClickInfobull(header.key)}
                title="Détails de l’indicateur"
              />
            )}
            {header.sort && <Tri headerKey={header.orderBy || header.key} order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} />}            </th>
        )}
      </tr>
    </thead>
  );
};

const TableBody = ({ headers, data, forMoyenne, total, selectedRows, handleSelectRow, isShowAvrage, isCenter, page, onClickDelete, handleInfoBullMoyenne, onClickSocialReason }: TableBodyProps) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr data-row-key={rowIndex} id={`table-selectable-row-key-${rowIndex}`} key={rowIndex}>
          <th className="fr-cell--fixed" scope="row">
            <div className="fr-checkbox-group fr-checkbox-group--sm">
              <input
                checked={!!selectedRows[page]?.find((item) => item.numéroFiness === row.numéroFiness)}
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
            <td className={`${isCenter || header.key === "favori" ? "fr-cell--center" : styles["cell-container"]} ${(row as any)[header.key] === 'Consultation non autorisée' ? styles["cell-not-authorized"] : ''}`} key={colIndex}>
              {header.key === "delete" && (
                <button
                  aria-controls="fr-modal-2"
                  className="fr-icon-delete-line fr-cell--center"
                  data-fr-opened="false"
                  onClick={() => onClickDelete(row["numéroFiness"])}
                  title="Supprimer"
                  type="button"
                />
              )}
              {header.key === "etsLogo" && (
                <div className={styles["logo-center"]}>
                  {row["type"] === "Sanitaire" && <span className={styles["logo-container"]}>{LogoÉtablissementTerritorialSanitaire}</span>}
                  {row["type"] === "Médico-social" && <span className={styles["logo-container"]}>{LogoÉtablissementTerritorial}</span>}
                  {row["type"] === "Entité juridique" && <span className={styles["logo-container"]}>{LogoEntitéJuridique}</span>}
                </div>
              )}
              {header.key === "favori" && <StarButtonList favorite={row as RechercheViewModel} parent="tab" />}
              {header.key === "socialReason" && (
                <a
                  className="fr-tile__link"
                  href={construisLeLien(row["type"], row["numéroFiness"])}
                  onClick={() => onClickSocialReason(row["socialReason"], row["numéroFiness"], row["type"])}
                  rel="noreferrer"
                  style={{ backgroundImage: "none" }}
                  target="_blank"
                >
                  {row[header.key]}
                </a>
              )}
              {header.key !== "socialReason" && (row as any)[header.key] !== null ? (row as any)[header.key] : header.key !== "socialReason" && "-"}
            </td>
          ))}
        </tr>
      ))}
      {isShowAvrage && data.length > 0 && <TableExtensionCalculMoyenne dataSource={forMoyenne} setEstCeOuvert={handleInfoBullMoyenne} total={total} />}
    </tbody>
  );
};

export const Table = ({
  headers,
  data = [],
  forMoyenne,
  total,
  selectedRows,
  setSelectedRows,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  isShowAvrage = false,
  isCenter = false,
  onClickInfobull,
  handleSelectAll,
  isAllSelected,
  page,
  onClickDelete,
  handleInfoBullMoyenne,
  onClickSocialReason,
}: DataTableProps) => {
  const handleSelectRow = (row: RechercheViewModel | ComparaisonViewModel) => {
    if (selectedRows[page]?.find((item) => row.numéroFiness === item.numéroFiness)) {
      setSelectedRows({ ...selectedRows, [page]: selectedRows[page].filter((item) => item.numéroFiness !== row.numéroFiness) });
    } else {
      selectedRows[page] ? setSelectedRows({ ...selectedRows, [page]: [...selectedRows[page], row] }) : setSelectedRows({ ...selectedRows, [page]: [row] });
    }
  };

  return (
    <div id="table-selectable-component">
      <div className="fr-table__wrapper">
        <div className={`fr-table__container ${!isShowAvrage ? styles["table_container_surcharge"] : ""}`}>
          <div className="fr-table__content">
            <table id="table-selectable">
              <TableHeader
                handleSelectAll={handleSelectAll}
                headers={headers}
                isAllSelected={isAllSelected}
                isCenter={isCenter}
                onClickInfobull={onClickInfobull}
                order={order}
                orderBy={orderBy}
                page={page}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
              />
              <TableBody
                data={data}
                forMoyenne={forMoyenne}
                handleInfoBullMoyenne={handleInfoBullMoyenne}
                handleSelectRow={handleSelectRow}
                headers={headers}
                isCenter={isCenter}
                isShowAvrage={isShowAvrage}
                onClickDelete={onClickDelete}
                onClickSocialReason={onClickSocialReason}
                page={page}
                selectedRows={selectedRows}
                total={total}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
