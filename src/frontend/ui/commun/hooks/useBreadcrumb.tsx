import { useEffect, useState } from 'react'

import { Breadcrumb } from '../../../configuration/BreadcrumbHandler'
import { useDependencies } from '../contexts/useDependencies'

export function useBreadcrumb(initialBreadcrumb: Breadcrumb) {
  const { breadcrumbHandler } = useDependencies()
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>(initialBreadcrumb)

  useEffect(() => {
    breadcrumbHandler.updateBreadCrum(breadcrumb)
    breadcrumbHandler.AddSubscription(setBreadcrumb)
  }, [])

  return { breadcrumb: breadcrumb }
}
