import { dependencies } from '../../../configuration/dependencies'
import { convertXmlToJs } from '../../../shared/gateways/xml-to-js/convertXmlToJs'
import { récupérerLesÉtablissementsTerritoriauxLoader } from '../gateways/établissementTerritorialFinessLoader'
import { sauvegarderLesÉtablissementsTerritoriaux } from '../use_cases/sauvegarderLesÉtablissementsTerritoriaux'

async function sauvegarderLesÉtablissementsTerritoriauxCron() {
  const { environmentVariables } = dependencies

  const result = sauvegarderLesÉtablissementsTerritoriaux(
    récupérerLesÉtablissementsTerritoriauxLoader,
    convertXmlToJs,
    environmentVariables.SFTP_LOCAL_PATH
  )

  console.info(result)
}

sauvegarderLesÉtablissementsTerritoriauxCron()
