import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'
import { PageRecherche } from '../frontend/ui/home/PageRecherche'

export default function PageDAccueil() {
  useBreadcrumb([])

  return <PageRecherche />
}
