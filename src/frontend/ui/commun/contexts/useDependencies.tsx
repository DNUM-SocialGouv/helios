import { createContext, ReactNode, useContext } from 'react'

import { frontDependencies, FrontDependencies } from '../../../configuration/frontDependencies'

const DependenciesContext = createContext<FrontDependencies>(frontDependencies())

export function useDependencies() {
  const dependencies = useContext<FrontDependencies>(DependenciesContext)

  return { ...dependencies }
}

type DependenciesProviderProps = Readonly<{
  children: ReactNode
  dependencies: FrontDependencies
}>

export const DependenciesProvider = ({ children, dependencies }: DependenciesProviderProps) => (
  <DependenciesContext.Provider value={dependencies}>
    {children}
  </DependenciesContext.Provider>
)
