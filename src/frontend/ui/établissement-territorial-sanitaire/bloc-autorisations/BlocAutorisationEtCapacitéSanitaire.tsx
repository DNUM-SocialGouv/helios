import styles from "./BlocAutorisationEtCapacitéSanitaire.module.css";
import { useExportExcelAutorisationSanitaire } from "./ExportExcelAutorisationsSanitaire";
import { EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsCapacitesViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import { GraphiqueCapacitésParActivité } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivité";
import { ContenuAutorisations } from "../InfoBulle/ContenuAutorisations";
import { ContenuAutresActivités } from "../InfoBulle/ContenuAutresActivités";
import { ContenuReconnaissancesContractuelles } from "../InfoBulle/ContenuReconnaissancesContractuelles";
import { ContenuÉquipementsMatérielsLourds } from "../InfoBulle/ContenuÉquipementsMatérielsLourds";

type BlocAutorisationEtCapacitéSanitaireProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  etabNom: string;
  établissementTerritorialSanitaireAutorisationsViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocAutorisationEtCapacitéSanitaire = ({ etabFiness, etabTitle, etabNom, établissementTerritorialSanitaireAutorisationsViewModel, opnedBloc, toggelBlocs }: BlocAutorisationEtCapacitéSanitaireProps) => {
  const { wording } = useDependencies();
  const { exportExcelAutorisationSanitaire } = useExportExcelAutorisationSanitaire(etabFiness, etabNom, établissementTerritorialSanitaireAutorisationsViewModel);

  if (établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} toggelBlocs={toggelBlocs} />;
  }

  const dataInformationBloc = () => {
    if (établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasAutorisés.length !== 0) {
      return <NotAUthorized indicateurs={établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasAutorisés} />;
    } else if (établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasRenseignees.length !== 0) {
      return <NoDataCallout indicateurs={établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasRenseignees} />;
    } else {
      return <></>;
    }

  }

  const handleExport = () => {
    exportExcelAutorisationSanitaire();
  }

  return (
    <Bloc isMain={false} opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} toggelBlocs={toggelBlocs}>
      {dataInformationBloc()}
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialSanitaireAutorisationsViewModel.graphiqueCapacitésParActivitéViewModel.lesCapacitésParActivitésSontEllesRenseignées && établissementTerritorialSanitaireAutorisationsViewModel.graphiqueCapacitésParActivitéViewModel.lesCapacitésParActivitésSontEllesAutorisées ?
          <GraphiqueCapacitésParActivité
            estSanitaire={true}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            graphiqueCapacitésParActivitéViewModel={établissementTerritorialSanitaireAutorisationsViewModel.graphiqueCapacitésParActivitéViewModel}
          /> : <></>}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesRenseignées && établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesAutorisées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuAutorisations
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
                source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
            identifiant="autorisations-amm-sanitaire"
            nomDeLIndicateur={wording.AUTORISATIONS_SANITAIRE}
            source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
          >
            <>
              {établissementTerritorialSanitaireAutorisationsViewModel.autorisationsAmm}
              {établissementTerritorialSanitaireAutorisationsViewModel.autorisations}
            </>
          </IndicateurGraphique>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesAutresActivitésSontEllesRenseignées && établissementTerritorialSanitaireAutorisationsViewModel.lesAutresActivitésSontEllesAutorisées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuAutresActivités
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
            identifiant="autres-activités-sanitaire"
            nomDeLIndicateur={wording.AUTRES_ACTIVITÉS_SAN}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autresActivités}
          </IndicateurGraphique>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesReconnaissancesContractuellesSontEllesRenseignées && établissementTerritorialSanitaireAutorisationsViewModel.lesReconnaissancesContractuellesSontEllesAutorisées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuReconnaissancesContractuelles
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesReconnaissancesContractuelles}
            identifiant="reconnaissances-contractuelles-sanitaire"
            nomDeLIndicateur={wording.RECONNAISSANCES_CONTRACTUELLES}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.reconnaissancesContractuelles}
          </IndicateurGraphique>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesÉquipementsMatérielsLourdsSontIlsRenseignés && établissementTerritorialSanitaireAutorisationsViewModel.lesÉquipementsMatérielsLourdsSontIlsAutorisés && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuÉquipementsMatérielsLourds
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
                source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
            identifiant="équipements-matériels-lourds-sanitaire"
            nomDeLIndicateur={wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS}
            source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.équipementsMatérielsLourds}
          </IndicateurGraphique>
        )}
        <li>
          <div className={styles["voir_plus"] + " fr-grid-row fr-grid-row--center"}>
            <button className="fr-btn fr-btn--secondary" onClick={handleExport}>
              {wording.BOUTON_TELECHARGER_AUTORISATIONS_ET_CAPACITES}
            </button>
          </div>
        </li>
      </ul>
    </Bloc>
  );
};
