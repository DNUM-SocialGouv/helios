import { BreadcrumbHandler } from './BreadcrumbHandler'
import { Paths } from './Paths'
import { Wording } from './wording/Wording'
import { WordingFr } from './wording/WordingFr'

export type FrontDependencies = {
  breadcrumbHandler: BreadcrumbHandler
  paths: Paths
  wording: Wording
}

function createFrontDependencies(): FrontDependencies {
  return {
    breadcrumbHandler: new BreadcrumbHandler(),
    paths: new Paths(),
    wording: new WordingFr(),
  }
}

export const frontDependencies = createFrontDependencies()
