/* Les erreurs remontees sont lies a l’attribut « aria-sort » sur les bouton de tri. Cet attribut est impose par le dsfr pour changer l’icon du bouton */
/* eslint-disable jsx-a11y/role-supports-aria-props */
import { Dispatch, SetStateAction } from "react";

import styles from "./Table.module.css";
import { TableExtensionCalculMoyenne } from "./TableExtensionCalculMoyenne";
import { LogoEntiteJuridiqueSvg } from "../../entité-juridique/bloc-activité/LogoEntitéJuridique";
import { ComparaisonViewModel, MoyenneResultatComparaison } from "../../home/ComparaisonViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { LogoEtablissementTerritorialMedicoSociauxSvg } from "../../établissement-territorial-médico-social/logo-établissement-territorial-médico-social";
import { LogoEtablissementTerritorialSanitaireSvg } from "../../établissement-territorial-sanitaire/logo-établissement-territorial-sanitaire";
import { StarButtonList } from "../StarButtonList/StarButtonList";

export type SelectedRows = Readonly<{
  [page: number]: RechercheViewModel[] | ComparaisonViewModel[] | (RechercheViewModel | ComparaisonViewModel)[];
}>;

interface Header {
  label: string;
  key: string;
  nomComplet: string;
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
  selectedRows?: SelectedRows;
  setSelectedRows?: Dispatch<SetStateAction<Readonly<SelectedRows>>>;
  order: string;
  orderBy: string;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  isShowAvrage: boolean;
  isCenter: boolean;
  isVScroll: boolean;
  onClickInfobull?: (name: string) => void;
  page: number;
  handleSelectAll?: () => void;
  isAllSelected?: boolean;
  onClickDelete: (finessNumber: string) => void;
  handleInfoBullMoyenne?: Dispatch<SetStateAction<boolean>>;
  isSimpleSearchTable?: boolean;
}

interface TableHeaderProps {
  headers: Header[];
  order: string;
  orderBy: string;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  onClickInfobull?: (name: string) => void;
  handleSelectAll?: () => void;
  isAllSelected?: boolean;
  isCenter: boolean;
  isSimpleSearchTable?: boolean;
}

interface TableBodyProps {
  headers: Header[];
  selectedRows?: SelectedRows;
  data: RechercheViewModel[] | ComparaisonViewModel[];
  forMoyenne?: MoyenneResultatComparaison;
  total?: number;
  handleSelectRow: (valeurs: any) => void;
  isShowAvrage: boolean;
  isCenter: boolean;
  page: number;
  onClickDelete: (finessNumber: string) => void;
  handleInfoBullMoyenne?: Dispatch<SetStateAction<boolean>>;
  isSimpleSearchTable?: boolean;
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
        aria-sort="ascending"
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
        aria-sort="descending"
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

const TableHeader = ({ headers, order, orderBy, setOrderBy, setOrder, onClickInfobull, handleSelectAll, isAllSelected, isCenter, isSimpleSearchTable }: TableHeaderProps) => {
  return (
    <thead>
      <tr className={styles["sticky-header"]}>
        {isSimpleSearchTable ? null :
          <th className="fr-cell--fixed" role="columnheader">
            <div className="fr-checkbox-group fr-checkbox-group--sm">
              <input checked={isAllSelected || false} id="table-select-checkbox-7748--0" name="row-select" onChange={handleSelectAll} type="checkbox" />
              <label className="fr-label" htmlFor="table-select-checkbox-7748--0">
                Séléctionner tous les éléments
              </label>
            </div>
          </th>}
        {headers.map((header) =>
          <th className={`${isCenter ? "fr-cell--center" : ""} ${header.key === 'socialReason' ? "fr-cell--fixed" : ''}`}
            key={header.key} title={header.nomComplet}>
            <span className="fr-cell__title">{header.label}</span>
            {header.info && onClickInfobull && (
              <button
                className={"fr-fi-information-line fr-mx-1w " + styles["info-container"]}
                onClick={() => onClickInfobull(header.key)}
                title="Détails de l’indicateur"
              />
            )}
            {header.sort && <Tri headerKey={header.orderBy ?? header.key} order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} />}            </th>
        )}
      </tr>
    </thead>
  );
};


const TableBody = ({ headers, data, forMoyenne, total, selectedRows, handleSelectRow, isShowAvrage, isCenter, page, onClickDelete, handleInfoBullMoyenne, isSimpleSearchTable }: TableBodyProps) => {
  const selectedMap = new Map();
  if (selectedRows) {
    selectedRows[page]?.forEach(element => {
      selectedMap.set(element.numéroFiness, true);
    });
  }

  const couleurLogo = "#000000"; // Logos en noir
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr aria-selected={selectedMap.get(row.numéroFiness)} data-row-key={row.numéroFiness} id={`table-selectable-row-key-${row.numéroFiness}`} key={row.numéroFiness}>
          {isSimpleSearchTable ? null :
            <th className="fr-cell--fixed" scope="row">
              <div className="fr-checkbox-group fr-checkbox-group--sm">
                <input
                  checked={!!selectedMap.get(row.numéroFiness)}
                  id={`table-select-checkbox-7748--${rowIndex}`}
                  name="row-select"
                  onChange={() => handleSelectRow(row)}
                  type="checkbox"
                />
                <label className="fr-label" htmlFor={`table-select-checkbox-7748--${rowIndex}`}>
                  Séléctionner {row.socialReason}
                </label>
              </div>
            </th>}
          {headers.map((header) => (
            <td className={`${isCenter || header.key === "favori" ? "fr-cell--center" : styles["cell-container"]} ${header.key === 'socialReason' ? "fr-cell--fixed" : ''} ${(row as any)[header.key] === 'Consultation non autorisée' ? styles["cell-not-authorized"] : ''}  ${selectedMap.get(row.numéroFiness) ? styles["selected-row"] : ""}`} key={row.numéroFiness + "" + header.key}>
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
                  {row["type"] === "Sanitaire" && <span className={styles["logo-container"]}>{LogoEtablissementTerritorialSanitaireSvg(couleurLogo)}</span>}
                  {row["type"] === "Médico-social" && <span className={styles["logo-container"]}>{LogoEtablissementTerritorialMedicoSociauxSvg(couleurLogo)}</span>}
                  {row["type"] === "Entité juridique" && <span className={styles["logo-container"]}>{LogoEntiteJuridiqueSvg(couleurLogo)}</span>}
                </div>
              )}
              {header.key === "favori" && <StarButtonList numeroFiness={row.numéroFiness} parent="tab" />}
              {header.key === "socialReason" && (
                <a
                  className="fr-tile__link"
                  href={construisLeLien(row["type"], row["numéroFiness"])}
                  rel="noreferrer"
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
  isVScroll = false,
  onClickInfobull,
  handleSelectAll,
  isAllSelected,
  page,
  onClickDelete,
  handleInfoBullMoyenne,
  isSimpleSearchTable,
}: DataTableProps) => {
  const handleSelectRow = (row: RechercheViewModel | ComparaisonViewModel) => {
    if (selectedRows && setSelectedRows) {
      if (selectedRows[page]?.find((item) => row.numéroFiness === item.numéroFiness)) {
        setSelectedRows({ ...selectedRows, [page]: selectedRows[page].filter((item) => item.numéroFiness !== row.numéroFiness) });
      } else {
        selectedRows[page] ? setSelectedRows({ ...selectedRows, [page]: [...selectedRows[page], row] }) : setSelectedRows({ ...selectedRows, [page]: [row] });
      }
    }
  };

  return (
    <div id="table-selectable-component">
      <div className="fr-table__wrapper">
        <div className={isVScroll ? styles["table_container_vscroll"] : styles["table_container_sticky"]}>
          <div className="fr-table__content">
            <table id="table-selectable">
              <TableHeader
                handleSelectAll={handleSelectAll}
                headers={headers}
                isAllSelected={isAllSelected}
                isCenter={isCenter}
                isSimpleSearchTable={isSimpleSearchTable}
                onClickInfobull={onClickInfobull}
                order={order}
                orderBy={orderBy}
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
                isSimpleSearchTable={isSimpleSearchTable}
                onClickDelete={onClickDelete}
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
