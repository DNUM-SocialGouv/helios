import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import { GraphiqueCapacitésParActivité } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivité";
import { ContenuAutorisations } from "../InfoBulle/ContenuAutorisations";
import { ContenuAutresActivités } from "../InfoBulle/ContenuAutresActivités";
import { ContenuReconnaissancesContractuelles } from "../InfoBulle/ContenuReconnaissancesContractuelles";
import { ContenuÉquipementsMatérielsLourds } from "../InfoBulle/ContenuÉquipementsMatérielsLourds";
import styles from "./BlocAutorisationEtCapacitéSanitaire.module.css";
import { EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsCapacitesViewModel";

type BlocAutorisationEtCapacitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireAutorisationsViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel;
}>;

export const BlocAutorisationEtCapacitéSanitaire = ({ établissementTerritorialSanitaireAutorisationsViewModel }: BlocAutorisationEtCapacitéSanitaireProps) => {
  const { wording } = useDependencies();

  return (
    <Bloc isMain={false} titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
      {établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasRenseignees.length !== 0 ? <NoDataCallout indicateurs={établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasRenseignees} /> :
        établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasAutorisés.length !== 0 ? <NotAUthorized indicateurs={établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéPasAutorisés} /> : <></>}

      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialSanitaireAutorisationsViewModel.graphiqueCapacitésParActivitéViewModel.lesCapacitésParActivitésSontEllesRenseignées && établissementTerritorialSanitaireAutorisationsViewModel.graphiqueCapacitésParActivitéViewModel.lesCapacitésParActivitésSontEllesAutorisées ?
          <GraphiqueCapacitésParActivité
            estSanitaire={true} graphiqueCapacitésParActivitéViewModel={établissementTerritorialSanitaireAutorisationsViewModel.graphiqueCapacitésParActivitéViewModel}
          /> : <></>}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesRenseignées && établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesAutorisées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuAutorisations
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
            identifiant="autorisations-sanitaire"
            nomDeLIndicateur={wording.AUTORISATIONS_SANITAIRE}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autorisations}
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
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesÉquipementsMatérielsLourds}
            identifiant="équipements-matériels-lourds-sanitaire"
            nomDeLIndicateur={wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.équipementsMatérielsLourds}
          </IndicateurGraphique>
        )}
      </ul>
    </Bloc>
  );
};
