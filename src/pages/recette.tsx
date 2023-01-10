import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'
import { PageDeRecette } from '../frontend/ui/recette/PageDeRecette'

export default function Recette() {
  useBreadcrumb([])

  return <PageDeRecette />
}
