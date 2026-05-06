import { BreadcrumbHandler } from "./BreadcrumbHandler";
import { Paths } from "./Paths";
import { Wording } from "./wording/Wording";
import { WordingFr } from "./wording/WordingFr";

export type FrontDependencies = Readonly<{
  breadcrumbHandler: BreadcrumbHandler;
  paths: Paths;
  wording: Wording;
}>;

function useFrontDependencies(): FrontDependencies {
  return defaultDependencies;
}

export const frontDependencies = useFrontDependencies;

export const defaultDependencies = {
  breadcrumbHandler: new BreadcrumbHandler(),
  paths: new Paths(),
  wording: new WordingFr(),
};
