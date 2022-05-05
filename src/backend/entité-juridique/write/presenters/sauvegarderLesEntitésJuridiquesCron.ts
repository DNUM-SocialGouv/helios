import { dependencies } from '../../../configuration/dependencies'
import { convertXmlToJs } from '../../../shared/gateways/xml-to-js/convertXmlToJs'
import { récupérerLesEntitésJuridiquesLoader } from '../gateways/entitéJuridiqueFinessLoader'
import { sauvegarderLesEntitésJuridiques } from '../use_cases/sauvegarderLesEntitésJuridiques'

async function sauvegarderLesEntitésJuridiquesCron() {
  const { environmentVariables } = dependencies

  console.info(sauvegarderLesEntitésJuridiques(récupérerLesEntitésJuridiquesLoader, convertXmlToJs, environmentVariables.SFTP_LOCAL_PATH))
}

sauvegarderLesEntitésJuridiquesCron()
