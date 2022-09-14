import { Page404 } from '../frontend/ui/erreurs/Page404'

export default function Custom404() {
  return (<Page404 />)
}

export function getStaticProps() {
  return {
    props: {},
    revalidate: true,
  }
}
