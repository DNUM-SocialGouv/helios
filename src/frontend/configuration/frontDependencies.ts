import * as Sentry from "@sentry/nextjs";
import { ParsedUrlQuery } from "querystring";

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

function createFrontDependencies(query?: ParsedUrlQuery): FrontDependencies {
  Sentry.init({
    dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
    environment: process.env["NEXT_PUBLIC_SENTRY_ENVIRONMENT"],
    tracesSampleRate: 1.0,
  });
  return {
    breadcrumbHandler: new BreadcrumbHandler(),
    paths: new Paths(),
    wording: new WordingFr(),
    isFeatureEnabled: isFeatureEnabled(query),
  };
}

export const frontDependencies = createFrontDependencies;
