import { createContext, ReactNode, useContext } from "react";

import { defaultDependencies, FrontDependencies, frontDependencies } from "../../../configuration/frontDependencies";

const DependenciesContext = createContext<FrontDependencies>(defaultDependencies);

export function useDependencies() {
  const dependencies = useContext<FrontDependencies>(DependenciesContext);

  return { ...dependencies };
}

type DependenciesProviderProps = Readonly<{
  children: ReactNode;
}>;

export const DependenciesProvider = ({ children }: DependenciesProviderProps) => {
  return <DependenciesContext.Provider value={frontDependencies()}>{children}</DependenciesContext.Provider>;
};
