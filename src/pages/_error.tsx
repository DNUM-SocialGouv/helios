import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextErrorComponent, { ErrorProps } from "next/error";

type PageErrorProps = Readonly<{
  error: Error;
  statusCode: number;
  hasGetInitialPropsRun: boolean;
}>;

type PageErrorServerProps = ErrorProps &
  Readonly<{
    hasGetInitialPropsRun: boolean;
  }>;

export default function PageError({ statusCode, hasGetInitialPropsRun, error }: PageErrorProps) {
  if (!hasGetInitialPropsRun && error) {
    Sentry.captureException(error);
  }

  return <NextErrorComponent statusCode={statusCode} />;
}

PageError.getInitialProps = async (context: NextPageContext): Promise<PageErrorServerProps> => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context);

  const { res, err, asPath } = context;

  const pageErrorProps: PageErrorServerProps = {
    ...errorInitialProps,
    hasGetInitialPropsRun: true,
  };

  if (res?.statusCode === 404) {
    return pageErrorProps;
  }

  if (err) {
    Sentry.captureException(err);

    await Sentry.flush(2000);

    return pageErrorProps;
  }

  Sentry.captureException(new Error(`[Helios] _error.ts getInitialProps missing data at path: ${asPath}`));
  await Sentry.flush(2000);

  return pageErrorProps;
};
