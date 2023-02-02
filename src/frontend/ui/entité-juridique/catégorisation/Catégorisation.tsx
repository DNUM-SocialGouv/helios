import { CatégorisationViewModel } from "../EntitéJuridiqueViewModel";

type CatégorisationProps = { catégorisationViewModel: CatégorisationViewModel };

export function Catégorisation({ catégorisationViewModel }: CatégorisationProps) {
  const catégorisationWording = catégorisationViewModel.catégorisationWording;
  return catégorisationWording ? <p>{catégorisationWording}</p> : null;
}
