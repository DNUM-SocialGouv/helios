import { useRouter } from "next/router";
import { createContext, ReactNode, useContext } from "react";

import { frontDependencies, FrontDependencies } from "../../../configuration/frontDependencies";

const DependenciesContext = createContext<FrontDependencies>(frontDependencies());

export function useDependencies() {
  const dependencies = useContext<FrontDependencies>(DependenciesContext);

  return { ...dependencies };
}

type DependenciesProviderProps = Readonly<{
  children: ReactNode;
}>;

export const DependenciesProvider = ({ children }: DependenciesProviderProps) => {
  const { query } = useRouter();
  return <DependenciesContext.Provider value={frontDependencies(query)}>{children}</DependenciesContext.Provider>;
};
