import { Wording, WordingFr } from '../ui/commun/wording/Wording'

export interface FrontDependenciesContainer {
  wording: Wording
}

function createFrontDependenciesContainer(): FrontDependenciesContainer {
  return {
    wording: new WordingFr(),
  }
}

export const frontDependencies = createFrontDependenciesContainer()
