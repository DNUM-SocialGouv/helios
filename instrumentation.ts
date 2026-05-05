import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: process.env["SENTRY_DSN"],
    environment: process.env["SENTRY_ENVIRONMENT"],
    tracesSampleRate: 1,
  });
}

export const onRequestError = Sentry.captureRequestError;
