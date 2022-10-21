import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from './ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel'

type BlocRessourcesHumainesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel
}>

export const BlocRessourcesHumainesMédicoSocial = (
  { établissementTerritorialMédicoSocialRessourcesHumainesViewModel }: BlocRessourcesHumainesMédicoSocialProps
) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_RESSOURCES_HUMAINES}
    >
      <ul className="indicateurs">

      </ul>
    </Bloc>
  )
}
