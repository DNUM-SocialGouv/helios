import { Wording } from '../ui/commun/wording/Wording'
import { WordingFr } from '../ui/commun/wording/WordingFr'

import { FilDArianneHandler } from './FilDArianneHandler'
import { Paths } from './Paths'

export interface FrontDependenciesContainer {
  wording: Wording
  paths: Paths
  filDArianneHandler: FilDArianneHandler
}

function createFrontDependenciesContainer(): FrontDependenciesContainer {
  return {
    wording: new WordingFr(),
    paths: new Paths(),
    filDArianneHandler: new FilDArianneHandler(),
  }
}

export const frontDependencies = createFrontDependenciesContainer()
