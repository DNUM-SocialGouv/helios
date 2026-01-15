import { useMemo } from "react";

import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { couleurDuFondHistogrammeJaune, couleurExtensionHistogrammeJaune } from "../../../commun/Graphique/couleursGraphique";
import HistogrammeHorizontalAvecRef from "../../../commun/Graphique/HistogrammeHorizontalAvecRef";

type GraphiqueMotifsRuptureContratsProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueRepartitionEffectif = ({ etabFiness, etabTitle, nomGraph, blocVigieRHViewModel }: GraphiqueMotifsRuptureContratsProps) => {

  const { wording } = useDependencies();

  // Construit les items à partir des données d’effectifs par filière
  // Règles :
  // - on prend la DERNIÈRE valeur non nulle/non-NaN de la série (dernier mois disponible)
  // - on met la filière en "Label" avec majuscule initiale
  // - la "value" est forcée ≥ 0 (sécurise contre valeurs négatives inattendues)
  const items: any[] = (blocVigieRHViewModel.lesDonneesEffectifs.data ?? []).map((c: any) => {
    // Série temporelle des effectifs pour la filière courante
    const serie: number[] = c?.dataCategorie?.dataFiliere ?? [];

    // Recherche depuis la fin le dernier point valide (≠ null et convertible en nombre)
    let i = serie.length - 1;
    while (i >= 0 && (serie[i] === null || Number.isNaN(Number(serie[i])))) i--;

    // Dernier effectif valide (ou 0 si aucun trouvé)
    const last = i >= 0 ? Number(serie[i]) : 0;

    // Libellé : première lettre en majuscule (ex. "soins" → "Soins")
    const label = c.categorie.charAt(0).toUpperCase() + c.categorie.slice(1);

    // On s’assure que la valeur est positive (évite d’écraser le treemap avec une valeur négative)
    return { label, value: Math.max(0, last) };
  });

  const {
    donneesEffectifs, couleursDeLHistogramme, libelles, valeursAdditionnelles
  } = useMemo(() => {
    const total = items.reduce((sum, d) => sum + d.value, 0);
    const donneesEffectifs = [
      ...items.map(d => d.value),
      total
    ];

    const libelles = [
      ...items.map(d => d.label),
    ];

    const valeursAdditionnelles = [
      ...items.map(d => total !== 0 ? `${Math.round((d.value / total) * 100)} %` : '0 %'),
    ];

    const couleursDeLHistogramme = items.map(() => {
      return {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      };
    })
    return { donneesEffectifs, couleursDeLHistogramme, libelles, valeursAdditionnelles };
  }, [blocVigieRHViewModel.lesDureesCdd, items]);

  const transcriptionIdentifiants = [wording.EFFECTIFS, wording.POURCENTAGE];

  return (
    <HistogrammeHorizontalAvecRef
      couleursDeLHistogramme={couleursDeLHistogramme}
      enteteLibelle={wording.FILIERE}
      epaisseur="FIN"
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      identifiants={transcriptionIdentifiants}
      libelles={libelles}
      nomGraph={nomGraph}
      refsManquants={[]}
      refsManquantsTitre={wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE}
      showRefValues={false}
      valeursAdditionnelles={valeursAdditionnelles}
      valeursDesHistogrammes={donneesEffectifs}
      valeursDesHistogrammesRef={[]}
    />
  );
};

export default GraphiqueRepartitionEffectif;
