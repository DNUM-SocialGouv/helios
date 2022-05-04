export type Breadcrumb = Readonly<{
  path: string
  label: string
}>[]

type DispatchBreadcrumbUpdate = (breadCrumb: Breadcrumb) => void
type UnsubscribeFromBreadcrumbUpdate = () => void

export class BreadcrumbHandler {
  private breadcrumb: Breadcrumb = []
  private subscriptions: DispatchBreadcrumbUpdate[] = []

  updateBreadCrum(breadcrumb: Breadcrumb) {
    this.breadcrumb = breadcrumb

    this.subscriptions.forEach((dispatchBreadCrumbUpdate) => dispatchBreadCrumbUpdate(this.breadcrumb))
  }

  AddSubscription(newSubscription: (breadCrumb: Breadcrumb) => void): UnsubscribeFromBreadcrumbUpdate {
    this.subscriptions.push(newSubscription)

    return () =>
      (this.subscriptions = this.subscriptions.filter((existingSubscription) => existingSubscription !== newSubscription))
  }
}
