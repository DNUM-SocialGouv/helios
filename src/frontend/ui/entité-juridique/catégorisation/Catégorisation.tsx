import { Badge } from "../../commun/Badge/Badge";
import { CatégorisationViewModel } from "./CatégorisationViewModel";

type CatégorisationProps = { catégorisationViewModel: CatégorisationViewModel };

export function Catégorisation({ catégorisationViewModel }: CatégorisationProps) {
  const catégorisationWording = catégorisationViewModel.catégorisationWording;
  return catégorisationWording ? <Badge className="fr-mb-1w" colour={catégorisationViewModel.catégorisationColour} label={catégorisationWording} /> : null;
}
