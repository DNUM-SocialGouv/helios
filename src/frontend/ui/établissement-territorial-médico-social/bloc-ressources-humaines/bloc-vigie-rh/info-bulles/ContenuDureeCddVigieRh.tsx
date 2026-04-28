import { ContenuVigieRhInfoBulleProps } from "./ContenuVigieRhInfoBulleProps";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

export const ContenuDureeCddVigieRh = ({ dateDeMiseAJour, dateDonneesArretees, source }: ContenuVigieRhInfoBulleProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source, dateDeMiseAJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
      <p>
        Répartition des contrats selon leur durée effective pour les CDD terminés durant le dernier   
        trimestre disponible. 
      </p>
      <p>
        La durée effective correspond au nombre de jours calendaires entre la date de début et la date de fin du contrat, connue avec 
        certitude lorsque le contrat se termine. En cas de rupture anticipée, la date réelle de fin de contrat est prise en compte, 
        et non la date prévisionnelle déclarée lors de la création du contrat.  
      </p>
      <div className="fr-table fr-table--layout-fixed fr-table--no-scroll">
          <div className="fr-table__wrapper">
            <div className="fr-table__container">
              <div className="fr-table__content">
                <table>
                  <thead>
                    <tr>
                      <th className="fr-col-6" scope="col">
                       Tranche de durée  
                      </th>
                      <th className="fr-col-6" scope="col">
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        moins d’une semaine 
                      </td>
                      <td>
                        durée &lt; 7 jours  
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Entre 1 semaine et 1 mois
                      </td>
                      <td>
                       7 &le; durée &lt; 31 jours  
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Entre 1 mois et 3 mois
                      </td>
                      <td>
                       31 &le; durée &lt; 92 jours
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Entre 3 et 6 mois
                      </td>
                      <td>
                       92 &le; durée &lt; 183 jours  
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Entre 6 et 12 mois
                      </td>
                      <td>
                       183 &le; durée &lt; 366 jours  
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Plus de 12 mois
                      </td>
                      <td>
                        durée &ge; 366 jours  
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
          <span className="fr-text--bold">{wording.LECTURE_INTERPRETATION} :</span>{" "} 
          Permet d’observer la répartition des durées effectives de contrats à durée déterminée et notamment la part des CDD très courts.    
        </p>
      </section>
      <section aria-label={wording.POPULATION}>
        <p>
          <span className="fr-text--bold">{wording.POPULATION} :</span>{" "} 
         CDD terminés durant le trimestre     
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          <span className="fr-text--bold">{wording.UNITE} :</span>{" "} 
           Nombre de contrats         
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">{wording.FRÉQUENCE} :</span>{" "}Trimestrielle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">{wording.SOURCES} :</span>{" "}DSN (Déclaration Sociale Nominative) - Données arrêtées :  {dateDonneesArretees}
        </p>
      </section>
    </>
  );
};
