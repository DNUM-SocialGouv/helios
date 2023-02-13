import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/Indicateur/BlocIndicateurVide";
import { GraphiqueNombrePassageUrgence } from "../../indicateur-métier/nombre-passage-urgence/GraphiqueNombrePassageUrgence";
import { EntitéJuridiqueActivitésViewModel } from "./EntitéJuridiqueActivitésViewModel";

type BlocActivitéSanitaireProps = Readonly<{
  entitéJuridiqueActivitéViewModel: EntitéJuridiqueActivitésViewModel;
}>;

export const BlocActivitéSanitaire = ({ entitéJuridiqueActivitéViewModel }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies();

  if (entitéJuridiqueActivitéViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_ACTIVITÉ} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className="indicateurs">
        <GraphiqueNombrePassageUrgence
          estEntitéJuridique={true}
          nombrePassageAuxUrgencesViewModel={entitéJuridiqueActivitéViewModel.nombreDePassageAuxUrgencesViewModel}
        />
      </ul>
    </Bloc>
  );
};
