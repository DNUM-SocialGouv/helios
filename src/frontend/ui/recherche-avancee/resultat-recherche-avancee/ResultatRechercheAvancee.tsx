import { useContext, useState } from "react";

import "@gouvfr/dsfr/dist/component/alert/alert.min.css";
import { RechercheAvanceeContext } from "../../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { Table } from "../../commun/Table/Table";
import { ComparaisonViewModel } from "../../home/ComparaisonViewModel";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { useSearchHistory } from "../../search-history/useSearchHistory";
import { TableFooterRechercheAvancee } from "./resultat-recherche-avancee-footer/RechercheAvanceeFooter";
import styles from "./ResultatRechercheAvancee.module.css"
import { TableHeaderRechercheAvancee } from "./TableHeaderRechercheAvancee";

const tableHeaders = [
  { label: "", nomComplet: "", key: "etsLogo", orderBy: "type", sort: true },
  { label: "", nomComplet: "", key: "favori" },
  { label: "Raison Sociale", nomComplet: "", key: "socialReason", orderBy: "raison_sociale_courte", sort: true },
  { label: "Commune", nomComplet: "", key: "commune", sort: true },
  { label: "Département", nomComplet: "", key: "departement", sort: true },
  { label: "N°FINESS", nomComplet: "", key: "numéroFiness", orderBy: "numero_finess", sort: true },
  { label: "Rattachement(s)", nomComplet: "", key: "rattachement" },
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
  const { wording } = useDependencies();
  const { saveSearchHistory } = useSearchHistory();

  const isAllSelected = data.length > 0 && selectedRows[page] && selectedRows[page].length === data.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows({ ...selectedRows, [page]: [] });
    } else {
      setSelectedRows({ ...selectedRows, [page]: data });
    }
  };

  const showAlert = () => {
    return Object.values(selectedRows).flat().length >= 2;
  }

  return (
    <>
      {showAlert() && (
        <div className={"fr-alert fr-alert--info fr-mt-2w fr-mb-1w " + styles['multiline']}>
          <h3 className="fr-alert__title">{wording.ALERTE_TYPE_DIFFERENT_TITRE}</h3>
          <p>{wording.ALERTE_TYPE_DIFFERENT_CORPS}</p>
        </div>
      )}
      <TableHeaderRechercheAvancee selectedRows={selectedRows} />
      <Table
        data={data}
        handleSelectAll={handleSelectAll}
        headers={tableHeaders}
        isAllSelected={isAllSelected}
        isCenter={false}
        isShowAvrage={false}
        isVScroll={false}
        onClickDelete={() => { }}
        onClickSocialReason={saveSearchHistory}
        order={rechercheAvanceeContext?.order || ""}
        orderBy={rechercheAvanceeContext?.orderBy || ""}
        page={page}
        selectedRows={selectedRows}
        setOrder={rechercheAvanceeContext?.setOrder || (() => { })}
        setOrderBy={rechercheAvanceeContext?.setOrderBy || (() => { })}
        setSelectedRows={setSelectedRows} />
      <TableFooterRechercheAvancee lastPage={lastPage} nombreDeResultatsMaxParPage={20} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => { })} />
    </>
  );
};
