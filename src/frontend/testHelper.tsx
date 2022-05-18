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

export const trimHtml = (reactElement: ReactChild): string => {
  let sentence = ''
  if (reactElement.props.children instanceof Array) {
    for (const children1 of reactElement.props.children) {
      if (children1.props?.children) {
        for (const children2 of children1.props.children) {
          sentence += children2
        }
      } else if (typeof children1 === 'string') {
        sentence += children1
      }
    }
  } else {
    sentence = reactElement.props.children
  }

  return sentence
}

export const nodeReactChildMatcher = (wording: ReactChild) => (_: any, node: Element | null) => {
  const hasText = (node: Element | null) => node?.textContent === trimHtml(wording)
  return hasText(node)
}

export const nodeTextMatcher = (wording: string) => (_: any, node: Element | null) => {
  const hasText = (node: Element | null) => node?.textContent === wording
  return hasText(node)
}
