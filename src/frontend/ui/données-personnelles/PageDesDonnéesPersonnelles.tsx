import { useDependencies } from "../commun/contexts/useDependencies";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { Cookies } from "../cookies/Cookies";

export const PageDesDonnéesPersonnelles = () => {
  const { wording } = useDependencies();

  return (
    <>
      <h1>{wording.DONNÉES_PERSONNELLES}</h1>
      <section aria-label={wording.FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT}>
        <h2>Finalité et fondement du traitement</h2>
        <p>
          <b>Helios – Fiche de synthèse</b> a pour finalité de proposer aux agents en <abbr title="Agence Régionale de Santé">ARS</abbr> une vision consolidée
          et unifiée des données associées aux acteurs et établissements sanitaires ou médico-sociaux. Ce traitement entre dans le cadre des missions d’intérêt
          public confiées aux ARS en application de l’article L 1431-2 du code de santé publique. Il est mis en œuvre sur le fondement de l’article 6 e)
          Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 (règlement général sur la protection des données ou{" "}
          <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr>
          ).
          <br />
          Les finalités ainsi déterminées sont explicites et les données collectées dans le cadre de ce traitement ne pourront être traitées que pour les
          finalités précitées. Les données personnelles collectées sont limitées au strict nécessaire (minimisation des données).
        </p>
      </section>
      <section aria-label={wording.PROTECTION_DES_DONNÉES_PERSONNELLES}>
        <h2>Vos droits en matière de données personnelles</h2>
        <p>
          Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l&apos;informatique, aux fichiers et aux libertés et au RGPD, vous disposez d&apos;un
          droit d&apos;accès et de rectification aux données vous concernant. Vous pouvez également demander la limitation du traitement de vos données et vous
          opposer, pour des raisons tenant à votre situation particulière, au traitement des données vous concernant. 
        </p>
        <p>En fonction de votre région, vous pouvez exercer ces droits en vous adressant au responsable de traitement de la région concernée :</p>
      </section>
      <table className="fr-table">
        <thead>
          <tr>
            <th>Agence Régionale de Santé  </th>
            <th>Adresse de contact du DPO </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Auvergne-Rhône-Alpes </td>
            <td>ars-bfc-dpd@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Bourgogne Franche Comté  </td>
            <td>ars-bfc-dpd@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Bretagne </td>
            <td>ars-bretagne-cil@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Centre Val de Loire   </td>
            <td>sofia.beau@ars.sante.fr  </td>
          </tr>
          <tr>
            <td>Corse  </td>
            <td>ars-corse-dpo@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Grand Est  </td>
            <td>ars-grandest-dpo@ars.sante.fr  </td>
          </tr>
          <tr>
            <td>Guadeloupe </td>
            <td>dpo_ars_guadeloupe@actecil.fr </td>
          </tr>
          <tr>
            <td>Guyane </td>
            <td>ars-guyane-informatique@ars.guyane.fr  </td>
          </tr>
          <tr>
            <td>Hauts de France </td>
            <td>ars-hdf-dpd@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Ile de France </td>
            <td>ars-idf-dpd@ars.sante.fr </td>
          </tr>
          <tr>
            <td>La Réunion </td>
            <td>ars-reunion-dpo@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Martinique </td>
            <td>ars-martinique-dpo@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Mayotte </td>
            <td>ars-mayotte-dpo@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Normandie </td>
            <td>ars-normandie-juridique@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Nouvelle Aquitaine </td>
            <td>ars-na-dpd@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Occitanie </td>
            <td>ars-oc-dpo@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Pays de la Loire </td>
            <td>ars-pdl-dpo@ars.sante.fr </td>
          </tr>
          <tr>
            <td>Provence Alpes Côte d’Azur   </td>
            <td>ars-paca-dpo@ars.sante.fr </td>
          </tr>
        </tbody>
      </table>
      <p>
        Au sein du ministère des solidarités et de la santé, vous pouvez vous adresser à Mme la Déléguée à la protection des données des ministères sociaux -
        14, avenue Duquesne, 75007 PARIS.
      </p>
      <p>
        Enfin, si vous estimez, après nous avoir contactés, que vos droits sur vos données ne sont pas respectés, vous pouvez adresser une réclamation auprès de
        la Commission nationale de l’informatique et des libertés.
      </p>
      <Cookies />
    </>
  );
};
