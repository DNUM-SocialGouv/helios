import { render, RenderResult } from '@testing-library/react'
import { ReactChild } from 'react'

import { BreadcrumbHandler } from './configuration/BreadcrumbHandler'
import { FrontDependencies } from './configuration/frontDependencies'
import { Paths } from './configuration/Paths'
import { WordingFr } from './configuration/wording/WordingFr'
import { DependenciesProvider } from './ui/commun/contexts/useDependencies'

export const renderFakeComponent = (component: ReactChild): RenderResult => {
  return render(
    <DependenciesProvider dependencies={fakeFrontDependencies}>
      {component}
    </DependenciesProvider>
  )
}

export const fakeFrontDependencies: FrontDependencies = {
  breadcrumbHandler: new BreadcrumbHandler(),
  paths: new Paths(),
  wording: new WordingFr(),
}
