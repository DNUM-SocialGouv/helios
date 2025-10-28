import { ChangeEvent, useCallback, useMemo, useState } from "react";

import {
  NatureContratsAnnuel,
  NatureContratsTrimestriel,
} from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import HistogrammeComparaisonVerticalAvecRef, { HistogrammeComparaisonVerticalAvecRefSerie } from "../../../../commun/Graphique/HistogrammeComparaisonVerticalAvecRef";
import type { CouleurHistogramme } from "../../../../commun/Graphique/couleursGraphique";
import type { Wording } from "../../../../../configuration/wording/Wording";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import { FrequencyFilter } from "../FrequencyFilter";

type GraphiqueNatureContratsProps = Readonly<{
  blocVigieRhViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueNatureContrats = ({ blocVigieRhViewModel }: GraphiqueNatureContratsProps) => {
  const { wording } = useDependencies();
  const palette = blocVigieRhViewModel.paletteNatureContrats;

  const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);
  const handleFrequency = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }, []);

  const isAnnuel = selectedFrequency === wording.ANNUEL;

  return (
    <div>
      <FrequencyFilter
        ListeFrquences={[wording.ANNUEL, wording.TRIMESTRIEL]}
        handleFrequency={handleFrequency}
        identifiant="frequency-filter-nature-contrats"
        selectedFrequency={selectedFrequency}
      />
      {isAnnuel ? (
        <GraphiqueNatureContratsAnnuel donnees={blocVigieRhViewModel.natureContratsAnnuel} palette={palette} wording={wording} />
      ) : (
        <GraphiqueNatureContratsTrimestriel donnees={blocVigieRhViewModel.natureContratsTrimestriel} palette={palette} wording={wording} />
      )}
    </div>
  );
};

type GraphiqueNatureContratsAnnuelProps = Readonly<{
  donnees: NatureContratsAnnuel[];
  palette: CouleurHistogramme[];
  wording: Wording;
}>;

type GraphiqueNatureContratsTrimestrielProps = Readonly<{
  donnees: NatureContratsTrimestriel[];
  palette: CouleurHistogramme[];
  wording: Wording;
}>;

type NatureContratCategorie = Readonly<{
  key: string;
  label: string;
}>;

const estTrimestriel = (
  valeur: NatureContratsAnnuel | NatureContratsTrimestriel,
): valeur is NatureContratsTrimestriel => "trimestre" in valeur && valeur.trimestre !== undefined;

const construitLibelleCategorie = (valeur: NatureContratsAnnuel | NatureContratsTrimestriel, isTrimestriel: boolean): NatureContratCategorie => {
  if (isTrimestriel && estTrimestriel(valeur)) {
    return { key: `${valeur.annee}-T${valeur.trimestre}`, label: `T${valeur.trimestre} ${valeur.annee}` };
  }
  return { key: valeur.annee.toString(), label: valeur.annee.toString() };
};

const prépareSeries = (
  donnees: (NatureContratsAnnuel | NatureContratsTrimestriel)[],
  palette: CouleurHistogramme[],
  isTrimestriel: boolean,
): Readonly<{
  libelles: string[];
  series: HistogrammeComparaisonVerticalAvecRefSerie[];
  natures: string[];
}> => {
  const sortedDonnees = [...donnees].sort((a, b) => {
    if (isTrimestriel && estTrimestriel(a) && estTrimestriel(b)) {
      const aKey = a.annee * 10 + a.trimestre;
      const bKey = b.annee * 10 + b.trimestre;
      return aKey - bKey;
    }
    return a.annee - b.annee;
  });

  const categories: NatureContratCategorie[] = [];
  const natures: string[] = [];
  const groupedByCategorie: Record<string, Record<string, NatureContratsAnnuel | NatureContratsTrimestriel>> = {};

  for (const valeur of sortedDonnees) {
    const categorie = construitLibelleCategorie(valeur, isTrimestriel);
    if (!categories.find((c) => c.key === categorie.key)) {
      categories.push(categorie);
    }

    if (!natures.includes(valeur.natureLibelle)) {
      natures.push(valeur.natureLibelle);
    }

    if (!groupedByCategorie[categorie.key]) {
      groupedByCategorie[categorie.key] = {};
    }
    groupedByCategorie[categorie.key][valeur.natureLibelle] = valeur;
  }

  const couleurParDefaut: CouleurHistogramme = palette[0] ?? { premierPlan: "#E2CF58" };

  const series: HistogrammeComparaisonVerticalAvecRefSerie[] = natures.map((natureLibelle, index) => {
    const couleur = palette.length > 0 ? palette[index % palette.length] : couleurParDefaut;
    const valeurs = categories.map(({ key }) => groupedByCategorie[key]?.[natureLibelle]?.effectif ?? null);
    const valeursRef = categories.map(({ key }) => groupedByCategorie[key]?.[natureLibelle]?.effectifRef ?? null);

    return {
      label: natureLibelle,
      valeurs,
      valeursRef,
      couleurHistogramme: couleur,
    };
  });

  const libelles = categories.map(({ label }) => label);

  return { libelles, series, natures };
};

const GraphiqueNatureContratsAnnuel = ({ donnees, palette, wording }: GraphiqueNatureContratsAnnuelProps) => {
  const { libelles, series, natures } = useMemo(() => prépareSeries(donnees, palette, false), [donnees, palette]);

  const transcriptionIdentifiants = useMemo(
    () => natures.flatMap((natureLibelle) => [natureLibelle, `${wording.MOYENNE_REF} - ${natureLibelle}`]),
    [natures, wording.MOYENNE_REF],
  );

  return (
    <HistogrammeComparaisonVerticalAvecRef
      highlightLastLabel
      legendContainerId="legende-nature-contrats-annuel"
      legendReferenceLabel={wording.MOYENNE_REF}
      libelles={libelles}
      series={series}
      transcription={{
        enteteLibelle: wording.ANNÉE,
        identifiantUnique: "transcription-nature-contrats-annuel",
        identifiants: transcriptionIdentifiants,
      }}
      valeurNonRenseigneeLabel={wording.NON_RENSEIGNÉ}
    />
  );
};

const GraphiqueNatureContratsTrimestriel = ({ donnees, palette, wording }: GraphiqueNatureContratsTrimestrielProps) => {
  const { libelles, series, natures } = useMemo(() => prépareSeries(donnees, palette, true), [donnees, palette]);

  const transcriptionIdentifiants = useMemo(
    () => natures.flatMap((natureLibelle) => [natureLibelle, `${wording.MOYENNE_REF} - ${natureLibelle}`]),
    [natures, wording.MOYENNE_REF],
  );

  return (
    <HistogrammeComparaisonVerticalAvecRef
      highlightLastLabel
      legendContainerId="legende-nature-contrats-trimestriel"
      legendReferenceLabel={wording.MOYENNE_REF}
      libelles={libelles}
      series={series}
      transcription={{
        enteteLibelle: wording.MOIS_ANNEES,
        identifiantUnique: "transcription-nature-contrats-trimestriel",
        identifiants: transcriptionIdentifiants,
      }}
      valeurNonRenseigneeLabel={wording.NON_RENSEIGNÉ}
    />
  );
};

export default GraphiqueNatureContrats;
