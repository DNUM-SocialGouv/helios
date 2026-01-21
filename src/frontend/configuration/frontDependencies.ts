import * as Sentry from "@sentry/nextjs";

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

  Sentry.init({
    dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
    environment: process.env["NEXT_PUBLIC_SENTRY_ENVIRONMENT"],
    tracesSampleRate: 1,
  });

  return defaultDependencies;
}

export const frontDependencies = useFrontDependencies;

export const defaultDependencies = {
  breadcrumbHandler: new BreadcrumbHandler(),
  paths: new Paths(),
  wording: new WordingFr(),
};
