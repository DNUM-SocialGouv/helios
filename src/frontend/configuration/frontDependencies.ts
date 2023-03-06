import * as Sentry from "@sentry/nextjs";

import { FEATURE_NAME, isFeatureEnabled } from "../utils/featureToggle";
import { BreadcrumbHandler } from "./BreadcrumbHandler";
import { Paths } from "./Paths";
import { Wording } from "./wording/Wording";
import { WordingFr } from "./wording/WordingFr";

export type FrontDependencies = Readonly<{
  breadcrumbHandler: BreadcrumbHandler;
  paths: Paths;
  wording: Wording;
  isFeatureEnabled: (feature: FEATURE_NAME) => boolean;
}>;

function createFrontDependencies(): FrontDependencies {
  Sentry.init({
    dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
    environment: process.env["NEXT_PUBLIC_SENTRY_ENVIRONMENT"],
    tracesSampleRate: 1.0,
  });

  return {
    breadcrumbHandler: new BreadcrumbHandler(),
    paths: new Paths(),
    wording: new WordingFr(),
    isFeatureEnabled,
  };
}

export const frontDependencies = createFrontDependencies();
