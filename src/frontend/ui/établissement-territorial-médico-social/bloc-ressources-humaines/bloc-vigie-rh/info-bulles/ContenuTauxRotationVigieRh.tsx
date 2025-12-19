import { BlockMath } from 'react-katex';
import "katex/dist/katex.min.css";

import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";


export const ContenuTauxRotationVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();
  const formula = `
\\frac{
  \\mathrm{(Nombre\\ de\\ nouveaux\\ contrats\\ +\\ Nombre\\ de\\ fins\\ de\\ contrat)}
}{
  2 \\times \\mathrm{Effectif\\ moyen\\ sur\\ le\\ trimestre}
}
`;


  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseAJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>Ce taux s’exprime comme : </p>
        <BlockMath math={formula} />
        <p>
          Exemple : si 20 nouveaux contrats et 30 fins de contrats ont été comptabilisés sur le trimestre, pour un effectif moyen de 100 personnes
          alors le taux de renouvellement des contrats est égal à (20+30)/(2*100) = 25%.
        </p>
        <p>
          Ainsi, plus le taux est élevé, plus le renouvellement des équipes a été important au cours du trimestre.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Trimestrielle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">{wording.SOURCES} :</span> DSN (Déclaration Sociale Nominative) - Données arrêtées :  {dateDonneesArretees}
        </p>
      </section>
    </>
  );
};
