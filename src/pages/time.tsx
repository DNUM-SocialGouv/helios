export default function Router({ time }: { time: string }) {
  return (<h1>
    {time}
  </h1>)
}

export function getStaticProps() {
  return {
    props: { time: new Date().toISOString() },
    revalidate: 5,
  }
}
