import { useRouter } from 'next/router'

import { récupèreLEntitéJuridiqueEndpoint } from '../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint'
import { EntitéJuridique } from '../../frontend/ui/entite/EntitéJuridique'

export default function router() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  const { numéroFINESS } = router.query

  // call controller in infra -> use-case -> loader -> etc
  const data = récupèreLEntitéJuridiqueEndpoint(numéroFINESS)

  return <EntitéJuridique titre={data} />
}
