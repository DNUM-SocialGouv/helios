import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCertificationHAS } from "../../../établissement-territorial-médico-social/InfoBulle/ContenuCertificationHAS";

type GraphiqueCertificationQualiscopeProps = Readonly<{
  finess: string;
}>;

export const GraphiqueCertificationQualiscope = ({ finess }: GraphiqueCertificationQualiscopeProps) => {
  const { wording } = useDependencies();

  return (
    <div>
      <IndicateurGraphique
        contenuInfoBulle={<ContenuCertificationHAS source={wording.HAS} />}
        identifiant="qualite-certification-qualiscope"
        nomDeLIndicateur={wording.CERTIFICATION_QUALISCOPE}
        source={wording.HAS}
      >
        <a className="fr-link fr-link--sm" href={"https://www.has-sante.fr/fiche-etablissement/" + finess} rel="noopener external noreferrer" target="_blank" title="Lien vers HAS">
          {wording.HAS_FICHE_PATH}{finess}
        </a>
      </IndicateurGraphique>
    </div>
  );
};
