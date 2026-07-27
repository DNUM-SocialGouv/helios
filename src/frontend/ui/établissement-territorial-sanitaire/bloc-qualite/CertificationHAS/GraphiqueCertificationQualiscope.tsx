import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCertificationHAS } from "../../../établissement-territorial-médico-social/InfoBulle/ContenuCertificationHAS";

type GraphiqueCertificationQualiscopeProps = Readonly<{
  hasFichePath: string;
}>;

export const GraphiqueCertificationQualiscope = ({ hasFichePath }: GraphiqueCertificationQualiscopeProps) => {
  const { wording } = useDependencies();

  return (
    <div>
      <IndicateurGraphique
        contenuInfoBulle={<ContenuCertificationHAS source={wording.HAS} />}
        identifiant="qualite-certification-qualiscope"
        nomDeLIndicateur={wording.CERTIFICATION_QUALISCOPE}
        source={wording.HAS}
      >
        <a className="fr-link fr-link--sm" href={hasFichePath} rel="noopener external noreferrer" target="_blank" title={`fiche HAS - ${wording.NOUVELLE_FENÊTRE}`}>
          {hasFichePath}
        </a>
      </IndicateurGraphique>
    </div>
  );
};
