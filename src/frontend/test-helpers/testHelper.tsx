import { render, RenderResult } from "@testing-library/react";
import { ReactNode, ReactElement } from "react";

import { BreadcrumbHandler } from "../configuration/BreadcrumbHandler";
import { FrontDependencies } from "../configuration/frontDependencies";
import { Paths } from "../configuration/Paths";
import { WordingFr } from "../configuration/wording/WordingFr";
import { DependenciesProvider } from "../ui/commun/contexts/useDependencies";
import { isFeatureEnabled } from "../utils/featureToggle";

// Cela permet de pouvoir tester ce qu'il y a dans <head>.
// https://github.com/vercel/next.js/discussions/11060
jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactElement[] }) => children,
}));

export const renderFakeComponent = (component: ReactNode): RenderResult => {
  return render(<DependenciesProvider>{component}</DependenciesProvider>);
};

export const fakeFrontDependencies: FrontDependencies = {
  breadcrumbHandler: new BreadcrumbHandler(),
  paths: new Paths(),
  wording: new WordingFr(),
  isFeatureEnabled: isFeatureEnabled(),
};

export const trimHtml = (reactElement: ReactElement): string => {
  let sentence = "";
  if (reactElement.props.children instanceof Array) {
    for (const children1 of reactElement.props.children) {
      if (children1.props?.children) {
        for (const children2 of children1.props.children) {
          sentence += children2;
        }
      } else if (typeof children1 === "string") {
        sentence += children1;
      }
    }
  } else if (reactElement.props.children instanceof Object) {
    sentence = reactElement.props.children.props.children;
  } else {
    sentence = reactElement.props.children;
  }

  return sentence;
};

export const htmlNodeAndReactElementMatcher = (wording: ReactElement) => (_: string, element?: Element | null) => {
  const hasText = (node?: Element | null) => node?.textContent === trimHtml(wording);
  return hasText(element);
};

export const textMatch =
  (wording: string) =>
    (_: string, element?: Element | null): boolean => {
      return element?.textContent === wording;
    };
export const annéeEnCours = new Date().getFullYear();
