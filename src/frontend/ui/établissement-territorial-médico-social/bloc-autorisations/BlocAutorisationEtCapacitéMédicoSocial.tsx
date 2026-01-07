import styles from "./BlocAutorisationEtCapacitéMédicoSocial.module.css";
import { useExportExcelAutorisationMS } from "./ExportExcelAutorisationMS";
import { ÉtablissementTerritorialMédicoSocialAutorisationsViewModel } from "./ÉtablissementTerritorialMédicoSocialAutorisationsViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuAutorisations } from "../InfoBulle/ContenuAutorisations";
import { ContenuCapacitéParActivité } from "../InfoBulle/ContenuCapacitéParActivité";

type BlocAutorisationEtCapacitéMédicoSocialProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  etabNom: string;
  établissementTerritorialAutorisationsMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialAutorisationsViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocAutorisationEtCapacitéMédicoSocial = ({
  etabFiness,
  etabTitle,
  etabNom,
  établissementTerritorialAutorisationsMédicoSocialViewModel,
  opnedBloc,
  toggelBlocs
}: BlocAutorisationEtCapacitéMédicoSocialProps) => {
  const { wording } = useDependencies();
  const { exportExcelAutorisationMS } = useExportExcelAutorisationMS(etabFiness, etabNom, établissementTerritorialAutorisationsMédicoSocialViewModel);

  if (établissementTerritorialAutorisationsMédicoSocialViewModel.lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} toggelBlocs={toggelBlocs} />;
  }

  const handleExport = () => {
    exportExcelAutorisationMS();
  }

  return (
    <Bloc isMain={false} opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} toggelBlocs={toggelBlocs}>
      {établissementTerritorialAutorisationsMédicoSocialViewModel.lesDonnéesAutorisationEtCapacitéPasAutorisés.length > 0 ? <NotAUthorized indicateurs={établissementTerritorialAutorisationsMédicoSocialViewModel.lesDonnéesAutorisationEtCapacitéPasAutorisés} /> :
        établissementTerritorialAutorisationsMédicoSocialViewModel.lesDonnéesAutorisationEtCapacitéPasRenseignees.length > 0 ? <NoDataCallout indicateurs={établissementTerritorialAutorisationsMédicoSocialViewModel.lesDonnéesAutorisationEtCapacitéPasRenseignees} /> :
          <></>}
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialAutorisationsMédicoSocialViewModel.lesCapacitésSontEllesAutorisées && établissementTerritorialAutorisationsMédicoSocialViewModel.lesCapacitésSontEllesRenseignées ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuCapacitéParActivité
                dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesCapacitésParActivités}
                source={Sources(wording.FINESS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesCapacitésParActivités}
            identifiant="capacité-par-activités-médico-social"
            nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
            source={Sources(wording.FINESS)}
          >
            {établissementTerritorialAutorisationsMédicoSocialViewModel.capacitéParActivitésHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>
        ) : <></>}
        {établissementTerritorialAutorisationsMédicoSocialViewModel.lesAutorisationsSontEllesAutorisées && établissementTerritorialAutorisationsMédicoSocialViewModel.lesAutorisationsSontEllesRenseignées ? (
          <>
            <IndicateurGraphique
              contenuInfoBulle={
                <ContenuAutorisations
                  dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesAutorisations}
                  source={Sources(wording.FINESS, wording.ARHGOS)}
                />
              }
              dateDeMiseÀJour={établissementTerritorialAutorisationsMédicoSocialViewModel.dateDeMiseÀJourDesAutorisations}
              identifiant="autorisations-médico-social"
              nomDeLIndicateur={wording.AUTORISATIONS_MS}
              source={Sources(wording.FINESS, wording.ARHGOS)}
            >
              {établissementTerritorialAutorisationsMédicoSocialViewModel.autorisations}
            </IndicateurGraphique>
            <li>
              <div className={styles["voir_plus"] + " fr-grid-row fr-grid-row--center"}>
                <button className="fr-btn fr-btn--secondary" onClick={handleExport}>
                  {wording.BOUTON_TELECHARGER_AUTORISATIONS_ET_CAPACITES}
                </button>
              </div>
            </li>
          </>
        ) : null}
      </ul>
    </Bloc>
  );
};
