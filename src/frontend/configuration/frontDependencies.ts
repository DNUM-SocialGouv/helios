import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { BreadcrumbHandler } from "./BreadcrumbHandler";
import { Paths } from "./Paths";
import { FEATURE_NAME, isFeatureEnabled } from "../utils/featureToggle";
import { Wording } from "./wording/Wording";
import { WordingFr } from "./wording/WordingFr";

export type FrontDependencies = Readonly<{
  breadcrumbHandler: BreadcrumbHandler;
  paths: Paths;
  wording: Wording;
  isFeatureEnabled: (feature: FEATURE_NAME) => boolean;
}>;

function useFrontDependencies(): FrontDependencies {
  const router = useRouter();

  const [dependencies, setDependencies] = useState(defaultDependencies);

  useEffect(() => {
    Sentry.init({
      dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
      environment: process.env["NEXT_PUBLIC_SENTRY_ENVIRONMENT"],
      tracesSampleRate: 1.0,
    });

    setDependencies({ ...dependencies, isFeatureEnabled: isFeatureEnabled(router?.query) });
  }, [router?.query]);

  return dependencies;
}

export const frontDependencies = useFrontDependencies;

export const defaultDependencies = {
  breadcrumbHandler: new BreadcrumbHandler(),
  paths: new Paths(),
  wording: new WordingFr(),
  isFeatureEnabled: isFeatureEnabled(),
};
