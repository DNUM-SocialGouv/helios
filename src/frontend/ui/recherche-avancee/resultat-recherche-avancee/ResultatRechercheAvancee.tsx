import { Dispatch, SetStateAction, useContext, useState } from "react";

import { TableFooter } from "./resultat-recherche-avancee-footer/TableFooter";
import { TableHeaderRechercheAvancee } from "./TableHeaderRechercheAvancee";
import { RechercheAvanceeContext } from "../../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { SuccessAlert } from "../../commun/SuccessAlert/SuccessAlert";
import { Table } from "../../commun/Table/Table";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { CategoriesFinessViewModel } from "../model/CategoriesFinessViewModel";

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
  selectedRows: Map<string, string>;
  setSelectedRows: Dispatch<SetStateAction<Map<string, string>>>;
  categories: CategoriesFinessViewModel[]
}>;

export const ResultatRechercheAvancee = ({ data, nombreRésultats, page, setPage, lastPage, selectedRows, setSelectedRows, categories }: ResultatRechercheAvanceeProps) => {
  const { wording } = useDependencies();
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

  // On disable le linter pour la ligne suivante,
  // « nombreRésultats » est de type string dans le navigateur donc la syntaxe « === » n’est pas possible et renvoie toujours « false »
  // eslint-disable-next-line eqeqeq
  const isAllResultsSelected = () => selectedRows.size == nombreRésultats;

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

  return (
    <div className="fr-mt-4w">
      {showAddToListSuccess && <SuccessAlert message={wording.LIST_ACTION_FAVORIS_SUCCESS_MESSAGE(favorisListName)} />}
      <TableHeaderRechercheAvancee categories={categories} isAllResultsSelected={isAllResultsSelected} onAddToFavorisSuccess={(listName: string) => handleAddToFavorisSuccess(listName)} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
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
    </div>
  );
};
