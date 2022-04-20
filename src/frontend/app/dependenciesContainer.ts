import { Wording } from '../ui/commun/wording/Wording'
import { WordingFr } from '../ui/commun/wording/WordingFr'

import { Paths } from './Paths'

export interface FrontDependenciesContainer {
  wording: Wording
  paths: Paths
}

function createFrontDependenciesContainer(): FrontDependenciesContainer {
  return {
    wording: new WordingFr(),
    paths: new Paths(),
  }
}

export const frontDependencies = createFrontDependenciesContainer()
