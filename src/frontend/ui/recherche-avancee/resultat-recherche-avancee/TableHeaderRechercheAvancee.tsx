import ExportExcelRechercheAvancee from "./ExportExcelRechercheAvancee";
import { ListActionsButton } from "../../liste/ListActionsButton";

type TableHeaderRechercheAvanceeProps = Readonly<{
  selectedRows: Map<string, string>;
  onAddToFavorisSuccess?: (ListName: string) => void;
}>;

export const TableHeaderRechercheAvancee = ({ selectedRows, onAddToFavorisSuccess }: TableHeaderRechercheAvanceeProps) => {

  const exportButton = <ExportExcelRechercheAvancee disabled={false} />

  return (
    <div className="fr-table__header fr-grid-row">
      <div className="fr-col">
        <p className="fr-table__detail">{`${selectedRows.size} ${selectedRows.size > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`}</p>
      </div>
      <div className="fr-col--right fr-mb-1w">
        <ListActionsButton exportButton={exportButton} onAddToFavorisSuccess={onAddToFavorisSuccess} selectedRows={selectedRows} />
      </div>
    </div>
  );
};
