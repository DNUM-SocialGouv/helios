import { render, RenderResult } from '@testing-library/react'
import { ReactChild } from 'react'

import { EnvironmentVariables } from '../src/backend/shared/entities/EnvironmentVariables'
import { BreadcrumbHandler } from '../src/frontend/configuration/BreadcrumbHandler'
import { FrontDependencies } from '../src/frontend/configuration/frontDependencies'
import { Paths } from '../src/frontend/configuration/Paths'
import { WordingFr } from '../src/frontend/configuration/wording/WordingFr'
import { DependenciesProvider } from '../src/frontend/ui/commun/contexts/useDependencies'

export const renderFakeComponent = (component: ReactChild): RenderResult => {
  return render(
    <DependenciesProvider dependencies={fakeFrontDependencies}>
      {component}
    </DependenciesProvider>
  )
}

export const fakeFrontDependencies: FrontDependencies = {
  breadcrumbHandler: new BreadcrumbHandler(),
  paths: new Paths(),
  wording: new WordingFr(),
}

export const environmentVariables: EnvironmentVariables = {
  SENTRY_AUTH_TOKEN: '1234567890',
  SENTRY_DSN: 'https://fake-sentry.io/11',
  SFTP_HOST: 'localhost',
  SFTP_IS_DEBUG: 'false',
  SFTP_LOCAL_PATH: 'data_test/fake_finess_local_path',
  SFTP_PASSWORD: 'fake_passw0rd',
  SFTP_PORT: '22',
  SFTP_PRIVATE_KEY: 'privateKey',
  SFTP_USERNAME: 'usr_finess_ls',
}
