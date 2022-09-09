import { useDependencies } from '../commun/contexts/useDependencies'
import '@gouvfr/dsfr/dist/component/table/table.min.css'

export const PageDesDonnéesPersonnelles = () => {
  const { wording } = useDependencies()

  return (
    <>
      <h1>
        {wording.DONNÉES_PERSONNELLES}
      </h1>
      <section aria-label={wording.FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT}>
        <h2>Finalité et fondement du traitement</h2>
        <p>
          <b>Helios – Fiche de synthèse</b>
          {' '}
          a pour finalité de proposer aux agents en
          {' '}
          <abbr title="Agence Régionale de Santé">ARS</abbr>
          {' '}
          une vision consolidée et unifiée des données associées aux acteurs et
          établissements sanitaires ou médico-sociaux.
          Ce traitement entre dans le cadre des missions d’intérêt public confiées aux ARS en application de l’article L 1431-2 du code de santé publique.
          Il est mis en œuvre sur le fondement de l’article 6 e) Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016
          (règlement général sur la protection des données ou
          {' '}
          <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr>
          ).
          <br />
          Les finalités ainsi déterminées sont explicites et les données collectées dans le cadre de ce traitement ne pourront être traitées que
          pour les finalités précitées. Les données personnelles collectées sont limitées au strict nécessaire (minimisation des données).
        </p>
      </section>
      <section aria-label={wording.PROTECTION_DES_DONNÉES_PERSONNELLES}>
        <h2>Protection des données personnelles</h2>
        <p>
          Sont destinataires des données les agents habilités du ministère des solidarités et de la santé et des ARS.
          Ces derniers s’engagent à ce que la collecte et le traitement de vos données, effectués à partir de
          {' '}
          <b>Helios – Fiche de synthèse</b>
          , soient conformes au RGPD et à la loi Informatique et Libertés.
        </p>
      </section>
      <section aria-label={wording.DROITS_DES_PERSONNES_CONCERNÉES}>
        <h2>Droits des personnes concernées</h2>
        <p>
          Conformément au règlement (UE) 2016/679 du Parlement européen et à la loi Informatique et Liberté 78-17 du 6 janvier 1978 modifiée,
          vous disposez d’un droit d’accès, de rectification et de limitation des données qui vous concernent.
          <br />
          Pour toute information ou exercice des droits précités, vous pouvez contacter le délégué à la protection des données (DPO) de l’ARS de votre région :
        </p>
        <table className="fr-table">
          <thead>
            <tr>
              <th>Agence Régionale de Santé</th>
              <th>
                Adresse de contact du
                <abbr title="Data Protection Officer (Délégué à la Protection des Données)">DPO</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Auvergne-Rhône-Alpes</td>
              <td>
                <a href="mailto:as-ara-dpd@ars.sante.fr">as-ara-dpd@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Bourgogne Franche Comté</td>
              <td>
                <a href="mailto:ars-bfc-dpd@ars.sante.fr">ars-bfc-dpd@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Bretagne</td>
              <td>
                <a href="mailto:ars-bretagne-cil@ars.sante.fr">ars-bretagne-cil@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Centre Val de Loire</td>
              <td>
                <a href="mailto:sofia.beau@ars.sante.fr">sofia.beau@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Corse</td>
              <td>
                <a href="mailto:ars-corse-dpo@ars.sante.fr">ars-corse-dpo@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Grand Est</td>
              <td>
                <a href="mailto:ars-grandest-dpo@ars.sante.fr">ars-grandest-dpo@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Guadeloupe</td>
              <td>
                <a href="mailto:dpo_ars_guadeloupe@actecil.fr">dpo_ars_guadeloupe@actecil.fr</a>
              </td>
            </tr>
            <tr>
              <td>Guyane</td>
              <td>
                <a href="mailto:ars-guyane-informatique@ars.guyane.fr">ars-guyane-informatique@ars.guyane.fr</a>
              </td>
            </tr>
            <tr>
              <td>Hauts de France</td>
              <td>
                <a href="mailto:ars-hdf-dpd@ars.sante.fr">ars-hdf-dpd@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Ile de France</td>
              <td>
                <a href="mailto:ars-idf-dpd@ars.sante.fr">ars-idf-dpd@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>La Réunion</td>
              <td>
                <a href="mailto:ars-reunion-dpo@ars.sante.fr">ars-reunion-dpo@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Martinique</td>
              <td>
                <a href="mailto:ars-martinique-dpo@ars.sante.fr">ars-martinique-dpo@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Mayotte</td>
              <td>
                <a href="mailto:ars-mayotte-dpo@ars.sante.fr">ars-mayotte-dpo@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Normandie</td>
              <td>
                <a href="mailto:ars-normandie-juridique@ars.sante.fr">ars-normandie-juridique@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Nouvelle Aquitaine</td>
              <td>
                <a href="mailto:ars-na-dpd@ars.sante.fr">ars-na-dpd@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Occitanie</td>
              <td>
                <a href="mailto:ars-oc-dpo@ars.sante.fr">ars-oc-dpo@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Pays de la Loire</td>
              <td>
                <a href="mailto:ars-pdl-dpo@ars.sante.fr">ars-pdl-dpo@ars.sante.fr</a>
              </td>
            </tr>
            <tr>
              <td>Provence Alpes Côte d’Azur</td>
              <td>
                <a href="mailto:ars-paca-dpo@ars.sante.fr">ars-paca-dpo@ars.sante.fr</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Au sein du ministère des solidarités et de la santé, vous pouvez vous adresser à Mme la Déléguée à la protection des données des ministères sociaux
          - 14, avenue Duquesne, 75007 PARIS.
          <br />
          Enfin, si vous estimez, après nous avoir contactés, que vos droits sur vos données ne sont pas respectés,
          vous pouvez adresser une réclamation auprès de la Commission nationale de l’informatique et des libertés.
        </p>
      </section>
    </>
  )
}
