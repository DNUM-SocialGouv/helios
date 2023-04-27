import { ReactNode } from "react";

export enum TAG_SIZE {
  SM = "sm",
  MD = "MD",
}

export function Tag({
  label,
  size = TAG_SIZE.MD,
  withArrow = false,
  isComposedTag = "",
  children,
}: {
  label?: string;
  size?: TAG_SIZE;
  withArrow?: boolean;
  isComposedTag?: string;
  children?: ReactNode;
}) {
  const arrowClass = withArrow ? " fr-fi-arrow-right-line fr-tag--icon-left" : "";
  const composedTag = isComposedTag ? " " + isComposedTag : "";
  return <p className={"fr-tag fr-tag--" + size + arrowClass + composedTag}>{label || children}</p>;
}
