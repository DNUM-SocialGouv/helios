import { createContext, ReactNode, useContext } from 'react'

import { frontDependencies, FrontDependenciesContainer } from '../../app/dependenciesContainer'

const DependenciesContext = createContext<FrontDependenciesContainer>(frontDependencies)

export function useDependencies() {
  const dependencies = useContext<FrontDependenciesContainer>(DependenciesContext)

  return { ...dependencies }
}

type DependenciesProviderProps = Readonly<{
  children: ReactNode
  dependencies?: FrontDependenciesContainer
}>

export const DependenciesProvider = ({ children, dependencies = frontDependencies }: DependenciesProviderProps) => (
  <DependenciesContext.Provider value={dependencies}>
    {children}
  </DependenciesContext.Provider>
)
