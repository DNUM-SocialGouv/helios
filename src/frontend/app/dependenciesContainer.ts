import { Wording } from '../ui/commun/wording/Wording'
import { WordingFr } from '../ui/commun/wording/WordingFr'

export interface FrontDependenciesContainer {
  wording: Wording
}

function createFrontDependenciesContainer(): FrontDependenciesContainer {
  return { wording: new WordingFr() }
}

export const frontDependencies = createFrontDependenciesContainer()
