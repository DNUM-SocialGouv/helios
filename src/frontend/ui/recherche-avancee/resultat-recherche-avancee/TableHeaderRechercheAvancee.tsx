import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

type TableHeaderRechercheAvanceeProps = Readonly<{
  selectedRows: any[];
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}>;

export const TableHeaderRechercheAvancee = ({ selectedRows, setShowAlert }: TableHeaderRechercheAvanceeProps) => {
  const router = useRouter();

  const onClickComparer = () => {
    const firstType = selectedRows[0].recherche.type;
    const hasDifferentTypes = selectedRows.some((row) => row.recherche.type !== firstType);
    const listFinessNumbers = selectedRows.map((row) => row.recherche.numéroFiness);

    if (hasDifferentTypes) {
      setShowAlert(true);
    } else {
      // Navigate if types are the same
      sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
      sessionStorage.setItem("comparaisonType", firstType);
      setShowAlert(false);
      router.push("/comparaison");
    }
  };

  return (
    <div className="fr-table__header">
      <p className="fr-table__detail">{selectedRows?.length} établissements sélectionnées</p>
      <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-md fr-btns-group--icon-left">
        <li>
          <button
            className="fr-btn fr-btn--icon-left fr-btn--secondary"
            disabled={selectedRows.length < 2}
            id="table-header-button-primary-7842"
            onClick={onClickComparer}
          >
            Comparer
          </button>
        </li>
      </ul>
    </div>
  );
};
