import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { SelectedRows } from "./ResultatRechercheAvancee";
import { AttribuesDefaults } from "../model/Attribues";

type TableHeaderRechercheAvanceeProps = Readonly<{
  selectedRows: SelectedRows;
}>;

export const TableHeaderRechercheAvancee = ({ selectedRows }: TableHeaderRechercheAvanceeProps) => {
  const router = useRouter();
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    setDisabledButton(false);
  }, [selectedRows])

  const isCompareButtonDisabled = () => {
    const formattedSelectedRows = Object.values(selectedRows).flat();
    return formattedSelectedRows.length < 2 || formattedSelectedRows.some((row) => row.type !== AttribuesDefaults.etablissementMedicoSocial);
  }

  const onClickComparer = () => {
    const formattedSelectedRows = Object.values(selectedRows).flat();
    const firstType = formattedSelectedRows[0].type;
    const listFinessNumbers = formattedSelectedRows.map((row) => row.numéroFiness);

    sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
    sessionStorage.setItem("comparaisonType", firstType);
    document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessNumbers))}; path=/`;
    document.cookie = `type=${encodeURIComponent(firstType)}; path=/`;
    router.push("/comparaison");
  };

  return (
    <div className="fr-table__header">
      <p className="fr-table__detail">{`${Object.values(selectedRows).flat().length} ${Object.values(selectedRows).flat().length > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`}</p>
      <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-md fr-btns-group--icon-left">
        <li>
          <button
            className="fr-btn fr-btn--icon-left fr-btn--secondary"
            disabled={isCompareButtonDisabled() || disabledButton}
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
