import { EnvironmentVariables } from '../shared/entities/EnvironmentVariables'
import { dotEnvConfig } from '../shared/gateways/dot-env/dotEnvConfig'
import { NodeEnvironmentVariables } from '../shared/gateways/node-environnement-variables/NodeEnvironmentVariables'

type Dependencies = Readonly<{
  environmentVariables: EnvironmentVariables
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const environmentVariables = new NodeEnvironmentVariables()

  return { environmentVariables }
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
