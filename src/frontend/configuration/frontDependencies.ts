import { FilDArianneHandler } from './FilDArianneHandler'
import { Wording } from './wording/Wording'
import { WordingFr } from './wording/WordingFr'

export type FrontDependencies = {
  filDArianneHandler: FilDArianneHandler
  wording: Wording
}

function createFrontDependencies(): FrontDependencies {
  return {
    filDArianneHandler: new FilDArianneHandler(),
    wording: new WordingFr(),
  }
}

export const frontDependencies = createFrontDependencies()
