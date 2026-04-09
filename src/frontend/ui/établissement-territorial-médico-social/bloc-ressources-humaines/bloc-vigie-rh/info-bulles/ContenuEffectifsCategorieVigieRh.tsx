import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import styles from "./InfoBulles.module.css";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuEffectifsCategorieVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Nombre de personnes physiques présentes en fin de mois, réparties par filière et catégorie de métiers.  
        </p>
        <p>Cet indicateur ne tient pas compte du temps de travail de chaque poste (concept distinct de l’emploi en ETP par exemple).    </p>
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
          Permet de comprendre la structure des métiers, d’identifier les filières et métiers en   
          croissance ou décroissance.   
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} : </span> 
           Personnes physiques        
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
