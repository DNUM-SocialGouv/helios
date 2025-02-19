import { SelectedRows } from "../../commun/Table/Table";
import { ListActionsButton } from "../../liste/ListActionsButton";

type TableHeaderRechercheAvanceeProps = Readonly<{
  selectedRows: SelectedRows;
}>;

export const TableHeaderRechercheAvancee = ({ selectedRows }: TableHeaderRechercheAvanceeProps) => {

  const selectedRowsValues = Object.values(selectedRows).flat();

  return (
    <div className="fr-table__header fr-grid-row">
      <div className="fr-col">
        <p className="fr-table__detail">{`${Object.values(selectedRows).flat().length} ${Object.values(selectedRows).flat().length > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`}</p>
      </div>
      <div className="fr-col--right">
        <ListActionsButton selectedRows={selectedRowsValues} />
      </div>
    </div>
  );
};
