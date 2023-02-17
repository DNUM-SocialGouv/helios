import { Bloc } from "../Bloc/Bloc";
import { useDependencies } from "../contexts/useDependencies";

export function BlocIndicateurVide({ title }: { title: string }) {
  const { wording } = useDependencies();

  return (
    <Bloc isExpandable={false} titre={title}>
      {wording.INDICATEURS_VIDES}
    </Bloc>
  );
}
