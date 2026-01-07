import { Bloc } from "../Bloc/Bloc";
import { useDependencies } from "../contexts/useDependencies";



export function BlocIndicateurVide({ title, opnedBloc, toggelBlocs }: Readonly<{ title: string, opnedBloc?: boolean, toggelBlocs?: () => void }>) {
  const { wording } = useDependencies();
  return (
    <Bloc opnedBloc={opnedBloc} titre={title} toggelBlocs={toggelBlocs}>
      {wording.INDICATEURS_VIDES}
    </Bloc>
  );
}
