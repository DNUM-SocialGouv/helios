import { render, RenderResult } from '@testing-library/react'
import { ReactChild, ReactElement } from 'react'

import { BreadcrumbHandler } from './configuration/BreadcrumbHandler'
import { FrontDependencies } from './configuration/frontDependencies'
import { Paths } from './configuration/Paths'
import { WordingFr } from './configuration/wording/WordingFr'
import { DependenciesProvider } from './ui/commun/contexts/useDependencies'

// Cela permet de pouvoir tester ce qu'il y a dans <head>.
// https://github.com/vercel/next.js/discussions/11060
jest.mock('next/head', () => (
  {
    __esModule: true,
    default: ({ children }: { children: ReactElement[] }) => children,
  }
))

export const renderFakeComponent = (component: ReactChild): RenderResult => {
  return render(
    <DependenciesProvider>
      {component}
    </DependenciesProvider>
  )
}

export const fakeFrontDependencies: FrontDependencies = {
  breadcrumbHandler: new BreadcrumbHandler(),
  paths: new Paths(),
  wording: new WordingFr(),
}

export const trimHtml = (reactElement: ReactElement): string => {
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

export const htmlNodeAndReactChildMatcher = (wording: ReactElement) => (_: any, node: Element | null) => {
  const hasText = (node: Element | null) => node?.textContent === trimHtml(wording)
  return hasText(node)
}

export const mockedDate = (date: string) => {
  class MockDate extends Date {
    constructor() {
      super(date)
    }
  }

  // @ts-ignore
  global.Date = MockDate
}
