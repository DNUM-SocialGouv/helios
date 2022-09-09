import { dependencies } from '../../backend/infrastructure/dependencies'
import { PageRégion } from '../../frontend/ui/région/PageRégion'
import { régions } from '../../frontend/ui/région/régions'

export default function Router({ région }: { région: string }) {
  if (!région) return null

  return <PageRégion région={région} />
}

export function getStaticPaths() {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export async function getStaticProps({ params }: { params: { région: string }}) {
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
