import { useContext, useState } from "react";

import "@gouvfr/dsfr/dist/component/alert/alert.min.css";
import { WordingFr } from "../../../configuration/wording/WordingFr";
import { RechercheAvanceeContext } from "../../commun/contexts/RechercheAvanceeContext";
import { Table } from "../../commun/Table/Table";
import { ComparaisonViewModel, initialData } from "../../home/ComparaisonViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { TableFooterRechercheAvancee } from "./resultat-recherche-avancee-footer/RechercheAvanceeFooter";
import { TableHeaderRechercheAvancee } from "./TableHeaderRechercheAvancee";

const tableHeaders = [
  { label: "", key: "etsLogo", orderBy: "type", sort: true },
  { label: "", key: "favori" },
  { label: "Raison Sociale", key: "socialReason", orderBy: "raison_sociale_courte", sort: true },
  { label: "Commune", key: "commune", sort: true },
  { label: "Département", key: "departement", sort: true },
  { label: "Finess", key: "numéroFiness", orderBy: "numero_finess", sort: true },
  { label: "Rattachement(s)", key: "rattachement" },
];

export type SelectedRows = Readonly<{
  [page: number]: RechercheViewModel[] | ComparaisonViewModel[] | (RechercheViewModel | ComparaisonViewModel)[];
}>;

type ResultatRechercheAvanceeProps = Readonly<{
  data: RechercheViewModel[];
  nombreRésultats: number;
  setPage: ((page: number, shallow?: boolean) => void) | undefined;
  lastPage: number;
  page: number;
}>;

export const ResultatRechercheAvancee = ({ data, nombreRésultats, page, setPage, lastPage }: ResultatRechercheAvanceeProps) => {
  const [selectedRows, setSelectedRows] = useState<SelectedRows>({ 1: [] });
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const wording = new WordingFr();

  const isAllSelected = data.length > 0 && selectedRows[page] && selectedRows[page].length === data.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows({ ...selectedRows, [page]: [] });
    } else {
      setSelectedRows({ ...selectedRows, [page]: data });
    }
  };

  return (
    <>
      {showAlert && (
        <div className="fr-alert fr-alert--info fr-mt-2w fr-mb-1w">
          <h3 className="fr-alert__title">{wording.ALERTE_TYPE_DIFFERENT_TITRE}</h3>
          <p>{wording.ALERTE_TYPE_DIFFERENT_CORPS}</p>{" "}
          <button
            className="fr-btn--close fr-btn"
            onClick={() => {
              setShowAlert(false);
            }}
            title="Masquer le message"
          ></button>
        </div>
      )}
      <TableHeaderRechercheAvancee selectedRows={selectedRows} setShowAlert={setShowAlert} />
      <Table
        data={data}
        forMoyenne={initialData}
        handleSelectAll={handleSelectAll}
        headers={tableHeaders}
        isAllSelected={isAllSelected}
        isShowAvrage={false}
        onClickDelete={() => {}}
        order={rechercheAvanceeContext?.order || ""}
        orderBy={rechercheAvanceeContext?.orderBy || ""}
        page={page}
        selectedRows={selectedRows}
        setOrder={rechercheAvanceeContext?.setOrder || (() => {})}
        setOrderBy={rechercheAvanceeContext?.setOrderBy || (() => {})}
        setSelectedRows={setSelectedRows}
      />
      <TableFooterRechercheAvancee lastPage={lastPage} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => {})} />
    </>
  );
};
