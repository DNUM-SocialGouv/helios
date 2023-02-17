import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuAutorisations } from "../InfoBulle/ContenuAutorisations";
import { ContenuAutresActivités } from "../InfoBulle/ContenuAutresActivités";
import { ContenuReconnaissancesContractuelles } from "../InfoBulle/ContenuReconnaissancesContractuelles";
import { ContenuÉquipementsMatérielsLourds } from "../InfoBulle/ContenuÉquipementsMatérielsLourds";
import styles from "./BlocAutorisationEtCapacitéSanitaire.module.css";
import { GraphiqueCapacitésParActivité } from "./GraphiqueCapacitésParActivité";
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsViewModel";

type BlocAutorisationEtCapacitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireAutorisationsViewModel: ÉtablissementTerritorialSanitaireAutorisationsViewModel;
}>;

export const BlocAutorisationEtCapacitéSanitaire = ({ établissementTerritorialSanitaireAutorisationsViewModel }: BlocAutorisationEtCapacitéSanitaireProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialSanitaireAutorisationsViewModel.lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} />;
  }

  return (
    <Bloc isMain={false} titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        <GraphiqueCapacitésParActivité
          graphiqueCapacitésParActivitéViewModel={établissementTerritorialSanitaireAutorisationsViewModel.graphiqueCapacitésParActivitéViewModel}
        />
        {établissementTerritorialSanitaireAutorisationsViewModel.lesAutorisationsSontEllesRenseignées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuAutorisations
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutorisations}
            identifiant="autorisations-sanitaire"
            nomDeLIndicateur={wording.AUTORISATIONS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autorisations}
          </IndicateurGraphique>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesAutresActivitésSontEllesRenseignées && (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuAutresActivités
                dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
                source={Sources(wording.FINESS, wording.ARHGOS)}
              />
            }
            dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDesAutresActivités}
            identifiant="autres-activités-sanitaire"
            nomDeLIndicateur={wording.AUTRES_ACTIVITÉS}
            source={Sources(wording.FINESS, wording.ARHGOS)}
          >
            {établissementTerritorialSanitaireAutorisationsViewModel.autresActivités}
          </IndicateurGraphique>
        )}
        {établissementTerritorialSanitaireAutorisationsViewModel.lesReconnaissancesContractuellesSontEllesRenseignées && (
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
        {établissementTerritorialSanitaireAutorisationsViewModel.lesÉquipementsMatérielsLourdsSontIlsRenseignés && (
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
