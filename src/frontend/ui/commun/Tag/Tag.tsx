import { ReactNode } from "react";

export enum TAG_SIZE {
  SM = "sm",
  MD = "MD",
}

export function Tag({
  label,
  size = TAG_SIZE.MD,
  withArrow = false,
  children,
}: {
  label?: string;
  size?: TAG_SIZE;
  withArrow?: boolean;
  children?: ReactNode;
}) {
  const arrowClass = withArrow ? " fr-fi-arrow-right-line fr-tag--icon-left" : "";
  return <p className={"fr-tag fr-tag--" + size + arrowClass}>{label || children}</p>;
}
