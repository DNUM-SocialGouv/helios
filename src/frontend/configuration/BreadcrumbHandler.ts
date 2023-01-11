import { ReactChild } from "react";

export type Breadcrumb = Readonly<{
  label: ReactChild;
  path: string;
}>[];

type UpdateBreadcrumb = (breadcrumb: Breadcrumb) => void;

export class BreadcrumbHandler {
  private subscriptions: UpdateBreadcrumb[] = [];

  updateBreadcrum(breadcrumb: Breadcrumb) {
    this.subscriptions.forEach((updateBreadcrumb) => updateBreadcrumb(breadcrumb));
  }

  addSubscription(newSubscription: UpdateBreadcrumb) {
    this.subscriptions.push(newSubscription);

    return () => {
      this.subscriptions = this.subscriptions.filter((existingSubscription) => existingSubscription !== newSubscription);
    };
  }
}
