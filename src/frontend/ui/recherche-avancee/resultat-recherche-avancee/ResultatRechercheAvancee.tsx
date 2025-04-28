import { useContext, useState } from "react";

import { TableFooter } from "./resultat-recherche-avancee-footer/TableFooter";
import { TableHeaderRechercheAvancee } from "./TableHeaderRechercheAvancee";
import { RechercheAvanceeContext } from "../../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { SuccessAlert } from "../../commun/SuccessAlert/SuccessAlert";
import { Table } from "../../commun/Table/Table";
import { AlerteComparaison } from "../../comparaison/alerte-comparaison/AlerteComparaison";
import { RechercheViewModel } from "../../home/RechercheViewModel";

const tableHeaders = [
  { label: "", nomComplet: "", key: "etsLogo", orderBy: "type", sort: true },
  { label: "", nomComplet: "", key: "favori" },
  { label: "Raison Sociale", nomComplet: "", key: "socialReason", orderBy: "raison_sociale_courte", sort: true },
  { label: "Commune", nomComplet: "", key: "commune", sort: true },
  { label: "Département", nomComplet: "", key: "departement", sort: true },
  { label: "N°FINESS", nomComplet: "", key: "numéroFiness", orderBy: "numero_finess", sort: true },
  { label: "Rattachement(s)", nomComplet: "", key: "rattachement" },
];

type ResultatRechercheAvanceeProps = Readonly<{
  data: RechercheViewModel[];
  nombreRésultats: number;
  setPage: ((page: number, shallow?: boolean) => void) | undefined;
  lastPage: number;
  page: number;
}>;

export const ResultatRechercheAvancee = ({ data, nombreRésultats, page, setPage, lastPage }: ResultatRechercheAvanceeProps) => {
  const { wording } = useDependencies();
  const [selectedRows, setSelectedRows] = useState<Map<string, string>>(new Map());
  const [favorisListName, setFavorisListName] = useState<string>("");
  const [showAddToListSuccess, setShowAddToListSuccess] = useState<boolean>(false);
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

  let isAllSelected = true;
  for (const etablissement of data) {
    if (!selectedRows.has(etablissement.numéroFiness)) {
      isAllSelected = false;
      break;
    }
  };


  const handleSelectAll = () => {
    const newSelection = new Map(selectedRows);
    if (isAllSelected) {
      data.forEach((etablissement) => newSelection.delete(etablissement.numéroFiness));
    } else {
      data.forEach((etablissement) => newSelection.set(etablissement.numéroFiness, etablissement.type));
    }
    setSelectedRows(newSelection);
  };

  const handleAddToFavorisSuccess = (listName: string): void => {
    if (listName?.trim().length > 0) {
      setFavorisListName(listName);
      setShowAddToListSuccess(true);
    } else {
      setFavorisListName("");
      setShowAddToListSuccess(false);
    }
  }

  const showAlert = selectedRows.size >= 2;


  return (
    <>
      {showAlert && <AlerteComparaison />}
      {showAddToListSuccess && <SuccessAlert message={wording.LIST_ACTION_FAVORIS_SUCCESS_MESSAGE(favorisListName)} />}
      <TableHeaderRechercheAvancee onAddToFavorisSuccess={(listName: string) => handleAddToFavorisSuccess(listName)} selectedRows={selectedRows} />
      <Table
        data={data}
        handleSelectAll={handleSelectAll}
        headers={tableHeaders}
        isAllSelected={isAllSelected}
        isCenter={false}
        isShowAvrage={false}
        isVScroll={false}
        onClickDelete={() => { }}
        order={rechercheAvanceeContext?.order ?? ""}
        orderBy={rechercheAvanceeContext?.orderBy ?? ""}
        selectedRows={selectedRows}
        setOrder={rechercheAvanceeContext?.setOrder || (() => { })}
        setOrderBy={rechercheAvanceeContext?.setOrderBy || (() => { })}
        setSelectedRows={setSelectedRows} />
      <TableFooter lastPage={lastPage} nombreDeResultatsMaxParPage={20} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => { })} />
    </>
  );
};
