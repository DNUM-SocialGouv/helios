import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import styles from "./InfoBulles.module.css";

import { useDependencies } from "../../../../commun/contexts/useDependencies";


export const ContenuEffectifsVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
      <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Nombre de personnes physiques présentes dans l’établissement le dernier jour du mois.   
          Une personne est comptée si un contrat couvre la date considérée, quel que soit son temps   
          de travail ou son nombre de contrats.  
        </p>
        <p>
          Un salarié ou agent employé à mi-temps sur tout le mois est compté comme 1 personne   
          physique. De la même manière, un salarié ou agent ayant effectué plusieurs contrats dans   
          l’établissement sur le mois est compté comme 1 personne physique.  
        </p>
      <div className="fr-table fr-table--layout-fixed fr-table--no-scroll">
          <div className={`fr-table--caption-bottom fr-mb-2w ${styles["centredCaption"]}`}>
            Découpage en filières et catégories de profession
          </div>
          <div className="fr-table__wrapper">
            <div className="fr-table__container">
              <div className="fr-table__content">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">
                        Filière
                      </th>
                      <th className="fr-col-8" scope="col">
                        Catégories de professions concernées
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Médical
                      </td>
                      <td>
                        Médecins hospitaliers . Médecins non hospitaliers . Sage-femmes .
                        Pharmaciens . Dentistes  . Internes
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Soins
                      </td>
                      <td>
                        Infirmières . Rééducation . Techniciens médicaux .
                        Psychologues . Aides-soignantes et auxiliaires de puériculture .
                        Autres auxiliaires de soins . Préparateurs en pharmacie et
                        spécialistes de l’appareillage médical
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Social & Éducatif
                      </td>
                      <td>
                        Intervention sociale et éducative . Moniteurs-éducateurs (social et sport) .
                        Aide à la personne . Animation socio-culturelle . Education et formation
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Administration/Technique/Logistique
                      </td>
                      <td>
                        Dirigeants et cadres . Agents des services hospitaliers .
                        Intendance . Technique . Administratif . Logistique . Autres
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section aria-label={wording.LECTURE_INTERPRETATION}>
        <p>
          <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} : </span> 
          Indicateur central pour suivre la dynamique des effectifs réels, repérer les hausses ou   
          baisses d’activité et situer les tendances d’évolution de l’établissement.   
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} : </span> 
          Personnes physiques en fin de mois     
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} : </span> 
           Nombre de personnes       
        </p>
      </section>
     <section aria-label={wording.DATE_OBSERVATION}>
        <p>
          <span className="fr-text--bold">{wording.DATE_OBSERVATION} : </span>  Dernier jour du mois  
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span> Mensuelle
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
