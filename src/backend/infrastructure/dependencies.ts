import { EntitéJuridiqueLoader } from '../métier/gateways/EntitéJuridiqueLoader'
import { EnvironmentVariables } from '../métier/gateways/EnvironmentVariables'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../métier/gateways/ÉtablissementTerritorialMédicoSocialLoader'
import { ÉtablissementTerritorialSanitaireLoader } from '../métier/gateways/ÉtablissementTerritorialSanitaireLoader'
import { dotEnvConfig } from './gateways/dot-env/dotEnvConfig'
import { TypeOrmEntitéJuridiqueLoader } from './gateways/entité-juridique-loader/TypeOrmEntitéJuridiqueLoader'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { typeOrmOrm } from './gateways/orm/typeOrmOrm'
import { TypeOrmÉtablissementTerritorialMédicoSocialLoader } from './gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialMédicoSocialLoader'
import { TypeOrmÉtablissementTerritorialSanitaireLoader } from './gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialSanitaireLoader'

export type Dependencies = Readonly<{
  environmentVariables: EnvironmentVariables
  entitéJuridiqueLoader: EntitéJuridiqueLoader
  établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader
  établissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const logger = new ConsoleLogger()
  const environmentVariables = new NodeEnvironmentVariables(logger)
  const orm = typeOrmOrm(environmentVariables)

  return {
    entitéJuridiqueLoader: new TypeOrmEntitéJuridiqueLoader(orm),
    environmentVariables,
    établissementTerritorialMédicoSocialLoader: new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm),
    établissementTerritorialSanitaireLoader: new TypeOrmÉtablissementTerritorialSanitaireLoader(orm),
  }
}

class DependenciesSingleton {
  private static instance: Dependencies

  static getInstance(): Dependencies {
    if (!DependenciesSingleton.instance) {
      DependenciesSingleton.instance = _instantiateDependencies()
    }

    return DependenciesSingleton.instance
  }
}

export const dependencies = DependenciesSingleton.getInstance()
