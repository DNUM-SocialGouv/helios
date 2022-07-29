export default function Custom404() {
  return (<h1 className="page404">404 - La page n’a pas été trouvée.</h1>)
}

export function getStaticProps() {
  return {
    props: {},
    revalidate: true,
  }
}
