import { Bloc } from "../Bloc/Bloc";
import { useDependencies } from "../contexts/useDependencies";



export function BlocIndicateurVide({ title, opnedBloc, toggelBlocs }: Readonly<{ title: string, opnedBloc?: boolean, toggelBlocs?: () => void }>) {
  const { wording } = useDependencies();
  return (
    <Bloc opnedBloc={opnedBloc} titre={title} toggelBlocs={toggelBlocs}>
      <ul>
        {wording.INDICATEURS_VIDES}
      </ul>

    </Bloc>
  );
}
