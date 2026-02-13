import styles from "./GraphiqueCertificationQualiscope.module.css"
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCertificationHAS } from "../../../établissement-territorial-médico-social/InfoBulle/ContenuCertificationHAS";
import { QualiteQualiscopeViewModel } from "../ÉtablissementTerritorialQualiteSanitaireViewModel";

type GraphiqueCertificationQualiscopeProps = Readonly<{
  data: QualiteQualiscopeViewModel;
  dateMiseAJour: string;
}>;

export const GraphiqueCertificationQualiscope = ({ data, dateMiseAJour }: GraphiqueCertificationQualiscopeProps) => {
  const { wording } = useDependencies();

  return (
    <div className={styles['bordure_indicateur']}>
      <IndicateurGraphique
        contenuInfoBulle={<ContenuCertificationHAS dateDeMiseÀJour={dateMiseAJour} source={wording.HAS} />}
        dateDeMiseÀJour={dateMiseAJour}
        identifiant="qualite-certification-qualiscope"
        nomDeLIndicateur={wording.CERTIFICATION_QUALISCOPE}
        source={wording.HAS}
      >
        <>
          <h6 className="fr-mt-1w fr-h6 fr-text-bold">{wording.DONNEES_QUALITE}</h6>
          <p>Appréciation globale des patients (MCO) :<b> {data.appreciationMco} </b> </p>
          <p>Prise en charge de la douleur en MCO : <b> {data.PriseEnChargeDouleur}</b></p>
          <p>Appréciation globale des patients (CA) : <b>{data.appreciationCa} </b> </p>
          <p>{data.certification}</p>
          <p>{wording.DATE_CERTIFICATION} : {data.dateCertification}</p>
        </>
      </IndicateurGraphique>
    </div>
  );
};
