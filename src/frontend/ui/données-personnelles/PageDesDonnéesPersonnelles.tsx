import { useDependencies } from "../commun/contexts/useDependencies";
import "@gouvfr/dsfr/dist/component/table/table.min.css";

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
        <h2>Protection des données personnelles</h2>
        <p>Le traitement Helios ne comporte aucune donnée personnelle.</p>
      </section>
    </>
  );
};
