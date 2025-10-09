import { useDependencies } from "../../../commun/contexts/useDependencies";
import { couleurDuFondHistogrammeJaune, couleurExtensionHistogrammeJaune } from "../../../commun/Graphique/couleursGraphique";
import HistogrammeHorizontalAvecRef from "../../../commun/Graphique/HistogrammeHorizontalAvecRef";

type GraphiqueDureeCDDProps = Readonly<{

}>;

const GraphiqueDureeCDD = ({ }: GraphiqueDureeCDDProps) => {

  const { wording } = useDependencies();

  return (
    <HistogrammeHorizontalAvecRef
      couleursDeLHistogramme={[{
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      },
      {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      },
      {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      },]}
      enteteLibelle={wording.DUREE}
      identifiants={[wording.DUREE_CDD, wording.DUREE_CDD_REF]}
      libelles={["Moins d'une semaine", "Entre 1 semaine et 1 mois", "Entre 1 et 3 mois"]}
      valeursDesHistogrammes={[1, 3, 8]}
      valeursDesHistogrammesRef={[5, 1, 7]}
    />
  );
};

export default GraphiqueDureeCDD;
