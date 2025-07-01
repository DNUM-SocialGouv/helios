import { Dispatch, SetStateAction, useContext } from "react";

import { Résultat, RésultatDeRecherche } from "../../../../backend/métier/entities/RésultatDeRecherche";
import { RechercheAvanceeContext, RechercheAvanceeContextValue } from "../../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../../commun/contexts/useDependencies";


async function getData(context: RechercheAvanceeContextValue) {
  const { terme, zoneGeo, zoneGeoD, zoneGeoType, typeStructure, statutJuridiqueStructure, capaciteMedicoSociaux, capaciteHandicap, capaciteAgees, activiteMco, activitePsy, activiteSsr, activiteUsld, categories, orderBy, order } = context;

  const capacites = [
    { classification: "non_classifie", ranges: capaciteMedicoSociaux || [] },
    { classification: "publics_en_situation_de_handicap", ranges: capaciteHandicap || [] },
    { classification: "personnes_agees", ranges: capaciteAgees || [] },
  ].filter((capacite) => capacite.ranges && capacite.ranges.length > 0);

  const activites = [
    { classification: "mco", ranges: activiteMco || [] },
    { classification: "psy", ranges: activitePsy || [] },
    { classification: "ssr", ranges: activiteSsr || [] },
    { classification: "usld", ranges: activiteUsld || [] },
  ].filter((activite) => activite.ranges && activite.ranges.length > 0);

  return fetch("/api/recherche-avancee", {
    body: JSON.stringify({ terme, zone: zoneGeo, zoneD: zoneGeoD, typeZone: zoneGeoType, type: typeStructure, statutJuridique: statutJuridiqueStructure, capaciteSMS: capacites, activiteSAN: activites, categories, orderBy, order, forExport: true }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then((response) => response.json())
    .then((data: RésultatDeRecherche) => {
      return data.résultats;
    }
    )
}

async function handleFullSelection(context: RechercheAvanceeContextValue | undefined, setSelectedRows: Dispatch<SetStateAction<Readonly<Map<string, string>>>>, isAllResultsSelected: boolean) {
  const newSelected = new Map<string, string>();
  if (!isAllResultsSelected && context) {
    const data = await getData(context);
    data.forEach((etablissement: Résultat) => newSelected.set(etablissement.numéroFiness, etablissement.type));
  }
  setSelectedRows(newSelected);
}

type ToutSelectionnerRechercheAvanceeProps = Readonly<{
  setSelectedRows: Dispatch<SetStateAction<Readonly<Map<string, string>>>>;
  isAllResultsSelected: () => boolean;
}>;

const ToutSelectionnerRechercheAvancee = ({ setSelectedRows, isAllResultsSelected }: ToutSelectionnerRechercheAvanceeProps) => {
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
  const { wording } = useDependencies();

  return (
    <button
      className="fr-btn fr-btn--tertiary-no-outline"
      name="selectionner"
      onClick={() => handleFullSelection(rechercheAvanceeContext, setSelectedRows, isAllResultsSelected())}
      title="selectionner"
      type="button"
    >
      {isAllResultsSelected() ? wording.TOUT_DESELECTIONNER : wording.TOUT_SELECTIONNER}
    </button>
  );
};

export default ToutSelectionnerRechercheAvancee;

