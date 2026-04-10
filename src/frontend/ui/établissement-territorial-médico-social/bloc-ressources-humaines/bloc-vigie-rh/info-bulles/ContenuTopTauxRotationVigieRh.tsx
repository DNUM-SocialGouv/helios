import { BlockMath } from "react-katex";

import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuTopTauxRotationVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();
  const formula = String.raw`
\frac{
  \mathrm{(entrées \ de\ personnes\ +\ sorties\ de\ personnes)}
}{
  2 \times \mathrm{effectif}
}
`;

 const formulaNumber = String.raw`
\frac{(12 + 8)}{2 \times 100}  = \frac{10}{100} \rightarrow 10\%
`;


  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>Mesure la part de l’effectif renouvelée entre deux périodes, à travers les entrées et les   
        sorties de personnes (turn-over).</p>
        <p>Ce taux s’exprime comme : </p>
        <BlockMath math={formula} />
        <p>
         Pour un effectif de 100 personnes, avec 12 entrées et 8 sorties, le taux de rotation est de   
        </p>
        <BlockMath math={formulaNumber} /> 
        <p>
          L’effectif est mesuré au dernier jour de la période.
        </p>
      </section>
      <section aria-label={wording.INDICATION_VARIATION}>
        <p>
          <span className="fr-text--bold">{wording.INDICATION_VARIATION} : </span> 
          Évolution absolue en points de pourcentage par rapport à la même période de l’année   
          précédente  
        </p>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} : </span>
        <p>
          <br/> 
          Un taux élevé peut traduire une forte mobilité, un renouvellement important ou des   
          ajustements rapides de main d’œuvre. Il permet d’apprécier la stabilité ou la volatilité de   
          l’effectif.     
        <br/>
          Cet indicateur porte uniquement sur les personnes et ne dépend pas du nombre de contrats   
          successifs détenus par un même salarié ou agent.  
        </p>
      </section>
      <section aria-label={wording.PRESENCE_PERIODE}>
          <span className="fr-text--bold">{wording.PRESENCE_PERIODE} : </span> 
        <p>
          <br/>
          Une personne est considérée comme présente dans une période si elle possède un contrat   
          actif à la date de fin de la période (dernier jour du trimestre).  
          <br/>
          Les mouvements sont calculés par comparaison entre les personnes présentes au dernier   
          jour de deux périodes consécutives.
          <br/>
          Entrée : personne absente au dernier jour de T−1 et présente au dernier jour de T
           <br/>
           Sortie : personne présente au dernier jour de T−1 et absente au dernier jour de T
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} : </span> 
          personnes physiques       
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} : </span> 
          pourcentage (%) ,  <span className="fr-text--bold">{wording.VARIATION}</span> en pp (% abs.)          
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
