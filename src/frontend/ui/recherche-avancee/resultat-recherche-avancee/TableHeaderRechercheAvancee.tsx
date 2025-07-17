import { Dispatch, SetStateAction } from "react";

import ExportExcelRechercheAvancee from "./ExportExcelRechercheAvancee";
import ToutSelectionnerRechercheAvancee from "./ToutSelectionnerRechercheAvancee";
import { ListActionsButton } from "../../liste/ListActionsButton";
import { CategoriesFinessViewModel } from "../model/CategoriesFinessViewModel";

type TableHeaderRechercheAvanceeProps = Readonly<{
  selectedRows: Map<string, string>;
  onAddToFavorisSuccess?: (ListName: string) => void;
  setSelectedRows: Dispatch<SetStateAction<Readonly<Map<string, string>>>>;
  isAllResultsSelected: () => boolean;
  categories: CategoriesFinessViewModel[];
}>;

export const TableHeaderRechercheAvancee = ({ selectedRows, onAddToFavorisSuccess, isAllResultsSelected, setSelectedRows, categories }: TableHeaderRechercheAvanceeProps) => {

  const exportButton = <ExportExcelRechercheAvancee categories={categories} disabled={false} />;
  const fullSelectButton = <ToutSelectionnerRechercheAvancee isAllResultsSelected={isAllResultsSelected} setSelectedRows={setSelectedRows} />

  return (
    <div className="fr-table__header fr-grid-row">
      <div className="fr-col">
        <p className="fr-table__detail">{`${selectedRows.size} ${selectedRows.size > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`}</p>
      </div>
      <div className="fr-col--right fr-mb-1w">
        <ListActionsButton exportButton={exportButton} fullSelectButton={fullSelectButton} onAddToFavorisSuccess={onAddToFavorisSuccess} selectedRows={selectedRows} />
      </div>
    </div>
  );
};
