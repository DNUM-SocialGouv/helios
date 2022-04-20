import { render } from '@testing-library/react'
import { ReactChild } from 'react'

import { FrontDependenciesContainer } from '../src/frontend/app/dependenciesContainer'
import { Paths } from '../src/frontend/app/Paths'
import { WordingFr } from '../src/frontend/ui/commun/wording/WordingFr'
import { DependenciesProvider } from '../src/frontend/ui/contexts/useDependencies'

export const renderFakeComponent = (component: ReactChild) => {
  const dependencies: FrontDependenciesContainer = fakeFrontDependenciesContainer

  return render(
    <DependenciesProvider dependencies={dependencies}>
      {component}
    </DependenciesProvider>
  )
}

export const fakeFrontDependenciesContainer: FrontDependenciesContainer = {
  paths: new Paths(),
  wording: new WordingFr(),
}
