import { TauxRotation } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { HistogrammeVertical } from "../../../../commun/Graphique/HistogrammeVertical";
import { StringFormater } from "../../../../commun/StringFormater";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";

type GraphiqueTauxRotationAnnuelProps = Readonly<{
  donneesTauxRotation: TauxRotation[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueTauxRotationAnnuel = ({ donneesTauxRotation, blocVigieRHViewModel }: GraphiqueTauxRotationAnnuelProps) => {
  const { wording } = useDependencies();

  return (
    <HistogrammeVertical
      annéesTotales={3}
      couleurDesLibelles={donneesTauxRotation.map(() => "#000")}
      couleursDeLHistogramme={blocVigieRHViewModel.couleursDeLHistogramme}
      entêteLibellé={wording.ANNÉE}
      identifiant={wording.TAUX_ROTATION}
      isVigieRh={true}
      libellés={donneesTauxRotation.map((donnee) => donnee.annee)}
      taillePoliceTicks={blocVigieRHViewModel.construisLesLibellesDesTicks()}
      valeurs={donneesTauxRotation.map((donnee) => StringFormater.transformInRoundedRate(donnee.rotation))}
    />
  )
}

export default GraphiqueTauxRotationAnnuel;
