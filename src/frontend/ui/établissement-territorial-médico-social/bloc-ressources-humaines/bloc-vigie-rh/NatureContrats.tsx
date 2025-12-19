import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";
import { FrequencyFilter } from "./FrequencyFilter";
import {
  NatureContratsAnnuel,
  NatureContratsTrimestriel
} from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import type { Wording } from "../../../../configuration/wording/Wording";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import type { CouleurHistogramme } from "../../../commun/Graphique/couleursGraphique";
import HistogrammeComparaisonVerticalAvecRef, {
  HistogrammeComparaisonVerticalAvecRefSerie
} from "../../../commun/Graphique/HistogrammeComparaisonVerticalAvecRef";

type GraphiqueNatureContratsProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  blocVigieRhViewModel: BlocVigieRHViewModel;
  showRefValues: boolean;
}>;

type GraphiqueNatureContratsAnnuelProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  donnees: NatureContratsAnnuel[];
  palette: CouleurHistogramme[];
  wording: Wording;
  showRefValues: boolean;
}>;

type GraphiqueNatureContratsTrimestrielProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  donnees: NatureContratsTrimestriel[];
  palette: CouleurHistogramme[];
  wording: Wording;
  showRefValues: boolean;
}>;

type NatureContratCategorie = Readonly<{
  key: string;
  label: string;
}>;

type Serie = Readonly<{
  libelles: string[];
  series: HistogrammeComparaisonVerticalAvecRefSerie[];
  natures: string[];
}>;

const GraphiqueNatureContrats = ({ etabFiness, etabTitle, nomGraph, blocVigieRhViewModel, showRefValues }: GraphiqueNatureContratsProps) => {
  const { wording } = useDependencies();
  const palette = blocVigieRhViewModel.paletteNatureContrats;

  const [selectedFrequency, setSelectedFrequency] = useState(wording.TRIMESTRIEL);
  const handleFrequency = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }, []);

  const isAnnuel = selectedFrequency === wording.ANNUEL;

  return (
    <div>
      <FrequencyFilter
        ListeFrquences={[wording.TRIMESTRIEL, wording.ANNUEL]}
        handleFrequency={handleFrequency}
        identifiant="frequency-filter-nature-contrats"
        selectedFrequency={selectedFrequency}
      />
      {isAnnuel ? (
        <GraphiqueNatureContratsAnnuel donnees={blocVigieRhViewModel.natureContratsAnnuel} etabFiness={etabFiness} etabTitle={etabTitle} nomGraph={nomGraph} palette={palette} showRefValues={showRefValues} wording={wording} />
      ) : (
        <GraphiqueNatureContratsTrimestriel donnees={blocVigieRhViewModel.natureContratsTrimestriel} etabFiness={etabFiness} etabTitle={etabTitle} nomGraph={nomGraph} palette={palette} showRefValues={showRefValues} wording={wording} />
      )}
    </div>
  );
};

const estTrimestriel = (valeur: NatureContratsAnnuel | NatureContratsTrimestriel): valeur is NatureContratsTrimestriel =>
  "trimestre" in valeur && valeur.trimestre !== undefined;

const construitLibelleCategorie = (valeur: NatureContratsAnnuel | NatureContratsTrimestriel, isTrimestriel: boolean): NatureContratCategorie => {
  if (isTrimestriel && estTrimestriel(valeur)) {
    return { key: `${valeur.annee}-T${valeur.trimestre}`, label: `T${valeur.trimestre} ${valeur.annee}` };
  }
  return { key: valeur.annee.toString(), label: valeur.annee.toString() };
};

const preparerSeries = (donnees: (NatureContratsAnnuel | NatureContratsTrimestriel)[], palette: CouleurHistogramme[], isTrimestriel: boolean, showRefValues: boolean): Serie => {
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
    if (!categories.some((c) => c.key === categorie.key)) {
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
    if (!showRefValues)
      return {
        label: natureLibelle,
        valeurs,
        couleurHistogramme: couleur,
      };
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

function trouverValeursManquantes(typeValeur: "valeursRef" | "valeurs", series: HistogrammeComparaisonVerticalAvecRefSerie[], libelles: string[]) {
  const valeursRefManquantes: string[] = [];
  for (const serie of series) {
    for (const [index, valeur] of serie[typeValeur]?.entries() ?? []) {
      if (typeof valeur !== "number" || Number.isNaN(valeur)) {
        const annee = libelles[index];
        const libelleComplet = `${serie.label} - ${annee}`;
        if (!valeursRefManquantes.includes(libelleComplet)) {
          valeursRefManquantes.push(libelleComplet);
        }
      }
    }
  }
  return valeursRefManquantes;
}

const GraphiqueNatureContratsAnnuel = ({ etabFiness, etabTitle, nomGraph, donnees, palette, wording, showRefValues }: GraphiqueNatureContratsAnnuelProps) => {
  const { libelles, series, natures } = useMemo(() => preparerSeries(donnees, palette, false, showRefValues), [donnees, palette]);

  const libellesValeursManquantes = useMemo(() => {
    return trouverValeursManquantes("valeurs", series, libelles);
  }, [libelles, series]);

  const libellesValeursRefManquantes = useMemo(() => {
    return trouverValeursManquantes("valeursRef", series, libelles);
  }, [libelles, series]);

  const transcriptionIdentifiants = useMemo(
    () => natures.flatMap((natureLibelle) => showRefValues ? [natureLibelle, `${wording.MOYENNE_REF} - ${natureLibelle}`] : [natureLibelle]),
    [natures, wording.MOYENNE_REF, showRefValues],
  );

  return (
    <HistogrammeComparaisonVerticalAvecRef
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      highlightLastLabel={false}
      legendContainerId="legende-nature-contrats-annuel"
      legendReferenceLabel={wording.MOYENNE_REF}
      libelles={libelles}
      libellesValeursManquantes={libellesValeursManquantes}
      libellesValeursRefManquantes={libellesValeursRefManquantes}
      nomGraph={nomGraph}
      series={series}
      showRefValues={showRefValues}
      transcription={{
        enteteLibelle: wording.ANNÉE,
        identifiantUnique: "transcription-nature-contrats-annuel",
        identifiants: transcriptionIdentifiants,
      }}
    />
  );
};

const GraphiqueNatureContratsTrimestriel = ({ etabFiness, etabTitle, nomGraph, donnees, palette, wording, showRefValues }: GraphiqueNatureContratsTrimestrielProps) => {
  const { libelles, series, natures } = useMemo(() => preparerSeries(donnees, palette, true, showRefValues), [donnees, palette]);

  const libellesValeursManquantes = useMemo(() => {
    return trouverValeursManquantes("valeurs", series, libelles);
  }, [libelles, series]);

  const libellesValeursRefManquantes = useMemo(() => {
    return trouverValeursManquantes("valeursRef", series, libelles);
  }, [libelles, series]);

  const transcriptionIdentifiants = useMemo(
    () => natures.flatMap((natureLibelle) => showRefValues ? [natureLibelle, `${wording.MOYENNE_REF} - ${natureLibelle}`] : [natureLibelle]),
    [natures, wording.MOYENNE_REF, showRefValues],
  );

  return (
    <HistogrammeComparaisonVerticalAvecRef
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      highlightLastLabel
      legendContainerId="legende-nature-contrats-trimestriel"
      legendReferenceLabel={wording.MOYENNE_REF}
      libelles={libelles}
      libellesValeursManquantes={libellesValeursManquantes}
      libellesValeursRefManquantes={libellesValeursRefManquantes}
      nomGraph={nomGraph}
      series={series}
      showRefValues={showRefValues}
      transcription={{
        enteteLibelle: wording.MOIS_ANNEES,
        identifiantUnique: "transcription-nature-contrats-trimestriel",
        identifiants: transcriptionIdentifiants,
      }}
    />
  );
};

export default GraphiqueNatureContrats;
