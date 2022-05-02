import { EnvironmentVariables } from '../shared/entities/EnvironmentVariables'
import { NodeEnvironmentVariables } from '../shared/gateways/NodeEnvironmentVariables'

type Dependencies = Readonly<{
  environmentVariables: EnvironmentVariables
}>

const instantiateDependencies = (): Dependencies => {
  const environmentVariables = new NodeEnvironmentVariables()

  return { environmentVariables }
}

class DependenciesSingleton {
  private static instance: Dependencies

  static getInstance(): Dependencies {
    if (!DependenciesSingleton.instance) {
      DependenciesSingleton.instance = instantiateDependencies()
    }

    return DependenciesSingleton.instance
  }
}

export const dependencies = DependenciesSingleton.getInstance()
