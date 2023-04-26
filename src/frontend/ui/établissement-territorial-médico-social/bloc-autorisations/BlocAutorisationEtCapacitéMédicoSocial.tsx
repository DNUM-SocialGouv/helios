import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { ContenuAutorisations } from "../InfoBulle/ContenuAutorisations";
import { ContenuCapacitéParActivité } from "../InfoBulle/ContenuCapacitéParActivité";
import styles from "./BlocAutorisationEtCapacitéMédicoSocial.module.css";
import { ÉtablissementTerritorialMédicoSocialAutorisationsViewModel } from "./ÉtablissementTerritorialMédicoSocialAutorisationsViewModel";

type BlocAutorisationEtCapacitéMédicoSocialProps = Readonly<{
  établissementTerritorialAutorisationsMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialAutorisationsViewModel;
}>;

export const BlocAutorisationEtCapacitéMédicoSocial = ({
  établissementTerritorialAutorisationsMédicoSocialViewModel,
}: BlocAutorisationEtCapacitéMédicoSocialProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialAutorisationsMédicoSocialViewModel.lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} />;
  }

  return (
    <Bloc isMain={false} titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ}>
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
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
          {établissementTerritorialAutorisationsMédicoSocialViewModel.capacitéParActivités}
        </IndicateurGraphique>

        {établissementTerritorialAutorisationsMédicoSocialViewModel.lesAutorisationsSontEllesRenseignées ? (
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
        ) : null}
      </ul>
    </Bloc>
  );
};
