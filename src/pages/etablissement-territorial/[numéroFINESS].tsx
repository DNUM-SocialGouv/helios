import { useRouter } from 'next/router'

export default function router() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()

  const { numéroFiness } = router.query

  return numéroFiness
}
