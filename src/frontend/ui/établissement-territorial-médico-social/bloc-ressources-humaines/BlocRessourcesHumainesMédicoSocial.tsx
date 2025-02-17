import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { BlocVigieRHViewModel } from "./bloc-vigie-rh/BlocVigieRHViewModel";
import { ContenuBlocRHMedicoSocialHelios } from "./contenu-bloc-rh-helios";
import { ContenuBlocRHMedicoSocialVigieRH } from "./contenu-bloc-rh-vigierh";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";

type BlocRessourcesHumainesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
  categorie: string;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
  statusSousBlocs: boolean[];
  setStatusSousBlocs: React.Dispatch<React.SetStateAction<boolean[]>>;
  blocVigieRhViewModel: BlocVigieRHViewModel;
}>;

export const BlocRessourcesHumainesMédicoSocial = ({
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel, categorie, opnedBloc, toggelBlocs, setStatusSousBlocs, statusSousBlocs, blocVigieRhViewModel
}: BlocRessourcesHumainesMédicoSocialProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialMédicoSocialRessourcesHumainesViewModel.lesDonnéesRessourcesHumainesNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc isMain={false} opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggelBlocs}>
      {process.env["NEXT_PUBLIC_SHOW_VIGIE_RH"] === 'true' && categorie === "500 - Etablissement d'hébergement pour personnes âgées dépendantes" ?
        <ContenuBlocRHMedicoSocialVigieRH
          blocVigieRhViewModel={blocVigieRhViewModel}
          setStatusSousBlocs={setStatusSousBlocs}
          statusSousBlocs={statusSousBlocs}
          établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialMédicoSocialRessourcesHumainesViewModel}
        />
        : <ContenuBlocRHMedicoSocialHelios
          établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialMédicoSocialRessourcesHumainesViewModel}
        />
      }
    </Bloc>
  );
};
