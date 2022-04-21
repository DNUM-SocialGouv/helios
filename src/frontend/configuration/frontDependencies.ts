import { FilDArianneHandler } from './FilDArianneHandler'
import { Paths } from './Paths'
import { Wording } from './wording/Wording'
import { WordingFr } from './wording/WordingFr'

export type FrontDependencies = {
  filDArianneHandler: FilDArianneHandler
  paths: Paths
  wording: Wording
}

export function frontDependencies(): FrontDependencies {
  return {
    filDArianneHandler: new FilDArianneHandler(),
    paths: new Paths(),
    wording: new WordingFr(),
  }
}
