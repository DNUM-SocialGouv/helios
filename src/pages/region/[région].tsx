import { GetStaticPathsResult, GetStaticPropsResult } from 'next'

import { dependencies } from '../../backend/infrastructure/dependencies'
import { PageRégion } from '../../frontend/ui/région/PageRégion'
import { régions } from '../../frontend/ui/région/régions'

type RouterProps = Readonly<{
  région: string
}>

export default function Router({ région }: RouterProps) {
  if (!région) return null

  return <PageRégion région={région} />
}

export function getStaticPaths(): GetStaticPathsResult {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export async function getStaticProps({ params }: { params: { région: string }}): Promise<GetStaticPropsResult<RouterProps>> {
  const { environmentVariables } = dependencies

  const régionsAcceptées = Object.keys(régions)

  if (!régionsAcceptées.includes(params.région)) {
    return { notFound: true, revalidate: 1 }
  }

  return {
    props: { région: params.région },
    revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE),
  }
}
