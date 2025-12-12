
import { BlocVigieRHViewModel } from "./bloc-vigie-rh/BlocVigieRHViewModel";
import { ContenuBlocRHMedicoSocialHelios } from "./contenu-bloc-rh-helios";
import { ContenuBlocRHMedicoSocialVigieRH } from "./contenu-bloc-rh-vigierh";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";


type BlocRessourcesHumainesMédicoSocialProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
  categorie: string;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
  statusSousBlocs: boolean[];
  setStatusSousBlocs: React.Dispatch<React.SetStateAction<boolean[]>>;
  blocVigieRhViewModel: BlocVigieRHViewModel;
}>;

export const BlocRessourcesHumainesMédicoSocial = ({
  etabFiness,
  etabTitle,
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel,
  categorie,
  opnedBloc,
  toggelBlocs,
  setStatusSousBlocs,
  statusSousBlocs,
  blocVigieRhViewModel
}: BlocRessourcesHumainesMédicoSocialProps) => {
  const { wording } = useDependencies();
  return (
    <Bloc isMain={false} opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES} toggelBlocs={toggelBlocs}>
      {process.env["NEXT_PUBLIC_SHOW_VIGIE_RH"] === 'true' && categorie === "500 - Etablissement d'hébergement pour personnes âgées dépendantes" ?
        <ContenuBlocRHMedicoSocialVigieRH
          blocVigieRhViewModel={blocVigieRhViewModel}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          etablissementTerritorialMedicoSocialRessourcesHumainesViewModel={établissementTerritorialMédicoSocialRessourcesHumainesViewModel}
          setStatusSousBlocs={setStatusSousBlocs}
          statusSousBlocs={statusSousBlocs}
        />
        : <ContenuBlocRHMedicoSocialHelios
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          etablissementTerritorialMedicoSocialRessourcesHumainesViewModel={établissementTerritorialMédicoSocialRessourcesHumainesViewModel}
        />
      }
    </Bloc>
  );
};
