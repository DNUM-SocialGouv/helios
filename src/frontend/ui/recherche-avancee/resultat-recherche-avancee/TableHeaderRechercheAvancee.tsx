import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { SelectedRows } from "./ResultatRechercheAvancee";

type TableHeaderRechercheAvanceeProps = Readonly<{
  selectedRows: SelectedRows;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}>;

export const TableHeaderRechercheAvancee = ({ selectedRows, setShowAlert }: TableHeaderRechercheAvanceeProps) => {
  const router = useRouter();
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    setDisabledButton(false);
  }, [selectedRows])

  const onClickComparer = () => {
    const formattedSelectedRows = Object.values(selectedRows).flat();
    const firstType = formattedSelectedRows[0].type;
    const hasDifferentTypes = formattedSelectedRows.some((row) => row.type !== firstType);
    const listFinessNumbers = formattedSelectedRows.map((row) => row.numéroFiness);

    if (hasDifferentTypes) {
      setShowAlert(true);
      setDisabledButton(true);
    } else {
      // Navigate if types are the same
      sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
      sessionStorage.setItem("comparaisonType", firstType);
      document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessNumbers))}; path=/`;
      document.cookie = `type=${encodeURIComponent(firstType)}; path=/`;
      setShowAlert(false);
      router.push("/comparaison");
    }
  };

  return (
    <div className="fr-table__header">
      <p className="fr-table__detail">{`${Object.values(selectedRows).flat().length} ${Object.values(selectedRows).flat().length > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`}</p>
      <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-md fr-btns-group--icon-left">
        <li>
          <button
            className="fr-btn fr-btn--icon-left fr-btn--secondary"
            disabled={Object.values(selectedRows).flat().length < 2 || disabledButton}
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
