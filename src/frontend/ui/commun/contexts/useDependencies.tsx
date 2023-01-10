import { createContext, ReactNode, useContext } from 'react'

import { frontDependencies, FrontDependencies } from '../../../configuration/frontDependencies'

const DependenciesContext = createContext<FrontDependencies>(frontDependencies)

export function useDependencies() {
  const dependencies = useContext<FrontDependencies>(DependenciesContext)

  return { ...dependencies }
}

type DependenciesProviderProps = Readonly<{
  children: ReactNode
}>

export const DependenciesProvider = ({ children }: DependenciesProviderProps) => (
  <DependenciesContext.Provider value={frontDependencies}>{children}</DependenciesContext.Provider>
)
