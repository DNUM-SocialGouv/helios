import { ReactElement } from "react";

export function Sources(sourceFournisseur: ReactElement, sourceOrigine?: ReactElement): ReactElement {
  if (sourceOrigine) {
    return (
      <>
        {sourceOrigine}
        {", "}
        {sourceFournisseur}
      </>
    );
  }

  return sourceFournisseur;
}
