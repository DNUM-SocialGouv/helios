import { Badge } from "../../commun/Badge/Badge";
import { CatégorisationViewModel } from "../EntitéJuridiqueViewModel";

type CatégorisationProps = { catégorisationViewModel: CatégorisationViewModel };

export function Catégorisation({ catégorisationViewModel }: CatégorisationProps) {
  const catégorisationWording = catégorisationViewModel.catégorisationWording;
  return catégorisationWording ? <Badge colour="purple-glycine" label={catégorisationWording} /> : null;
}
