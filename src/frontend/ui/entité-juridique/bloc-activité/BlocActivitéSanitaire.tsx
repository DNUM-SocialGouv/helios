import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { EntitéJuridiqueActivitésViewModel } from "../EntitéJuridiqueViewModel";
import styles from "./BlocActivitéSanitaire.module.css";
import { GraphiqueNombrePassageUrgence } from "./GraphiqueNombrePassageUrgence";

type BlocActivitéSanitaireProps = Readonly<{
  entitéJuridiqueActivitéViewModel: EntitéJuridiqueActivitésViewModel;
}>;

export const BlocActivitéSanitaire = ({ entitéJuridiqueActivitéViewModel }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies();

  if (entitéJuridiqueActivitéViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    // TODO : Extraire dans un common IndicateursVide
    return (
      <Bloc isExpandable={false} titre={wording.TITRE_BLOC_ACTIVITÉ}>
        {wording.INDICATEURS_VIDES}
      </Bloc>
    );
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        <GraphiqueNombrePassageUrgence
          dateMiseAJour={entitéJuridiqueActivitéViewModel.dateDeMiseÀJourDuNombreDePassagesAuxUrgences}
          nombreDePassagesAuxUrgences={entitéJuridiqueActivitéViewModel.nombreDePassagesAuxUrgences}
        />
      </ul>
    </Bloc>
  );
};
