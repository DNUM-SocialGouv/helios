import { render, RenderResult } from '@testing-library/react'
import { ReactChild } from 'react'

import { FilDArianneHandler } from '../src/frontend/configuration/FilDArianneHandler'
import { FrontDependencies } from '../src/frontend/configuration/frontDependencies'
import { WordingFr } from '../src/frontend/configuration/wording/WordingFr'
import { DependenciesProvider } from '../src/frontend/ui/commun/contexts/useDependencies'

export const renderFakeComponent = (component: ReactChild): RenderResult => {
  return render(
    <DependenciesProvider dependencies={fakeFrontDependencies}>
      {component}
    </DependenciesProvider>
  )
}

export const fakeFrontDependencies: FrontDependencies = {
  filDArianneHandler: new FilDArianneHandler(),
  wording: new WordingFr(),
}
