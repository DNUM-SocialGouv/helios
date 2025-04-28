import ExportExcelRechercheAvancee from "./ExportExcelRechercheAvancee";
import { SelectedRows } from "../../commun/Table/Table";
import { ListActionsButton } from "../../liste/ListActionsButton";

type TableHeaderRechercheAvanceeProps = Readonly<{
  selectedRows: SelectedRows;
  onAddToFavorisSuccess?: (ListName: string) => void;
}>;

export const TableHeaderRechercheAvancee = ({ selectedRows, onAddToFavorisSuccess }: TableHeaderRechercheAvanceeProps) => {
  const selectedRowsValues = Object.values(selectedRows).flat();

  const exportButton = <ExportExcelRechercheAvancee disabled={false} />

  return (
    <div className="fr-table__header fr-grid-row">
      <div className="fr-col">
        <p className="fr-table__detail">{`${Object.values(selectedRows).flat().length} ${Object.values(selectedRows).flat().length > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`}</p>
      </div>
      <div className="fr-col--right fr-mb-1w">
        <ListActionsButton exportButton={exportButton} onAddToFavorisSuccess={onAddToFavorisSuccess} selectedRows={selectedRowsValues} />
      </div>
    </div>
  );
};
