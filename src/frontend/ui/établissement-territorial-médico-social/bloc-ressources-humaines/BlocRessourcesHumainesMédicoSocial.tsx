import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { ContenuBlocRHMedicoSocialHelios } from "./contenu-bloc-rh-helios";
import { ContenuBlocRHMedicoSocialVigieRH } from "./contenu-bloc-rh-vigierh";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";

type BlocRessourcesHumainesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocRessourcesHumainesMédicoSocial = ({
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel, opnedBloc, toggelBlocs
}: BlocRessourcesHumainesMédicoSocialProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialMédicoSocialRessourcesHumainesViewModel.lesDonnéesRessourcesHumainesNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc isMain={false} opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggelBlocs}>
      {process.env["NEXT_PUBLIC_SHOW_VIGIE_RH"] === 'true' ?
        <ContenuBlocRHMedicoSocialVigieRH établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialMédicoSocialRessourcesHumainesViewModel} />
        : <ContenuBlocRHMedicoSocialHelios établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialMédicoSocialRessourcesHumainesViewModel} />
      }
    </Bloc>
  );
};
