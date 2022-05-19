import { useRouter } from 'next/router'

export default function router() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  const { numéroFINESS } = router.query

  // call controller in infra -> use-case -> loader -> etc

  return <p>
    Post:
    {numéroFINESS}
  </p>
}
