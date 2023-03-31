import { ChangeEvent, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Select } from "../../commun/Select/Select";
import { ContenuCapacitéParActivités } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuCapacitéParActivités";
import { GraphiqueCapacitésParActivitéViewModel } from "./GraphiqueCapacitésParActivitéViewModel";

type GraphiqueCapacitésParActivitéProps = Readonly<{
  graphiqueCapacitésParActivitéViewModel: GraphiqueCapacitésParActivitéViewModel;
}>;

type listeDeroulanteAnneesProps = {
  setAnnéeEnCours: Function;
  annees: number[];
};

const ListeDéroulanteDesAnnéesDesCapacités = ({ setAnnéeEnCours, annees }: listeDeroulanteAnneesProps) => {
  const { wording } = useDependencies();

  if (annees.length > 0) {
    return (
      <Select
        label={wording.ANNÉE}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          setAnnéeEnCours(Number(event.target.value));
        }}
        options={annees}
      />
    );
  }

  return <></>;
};

export const GraphiqueCapacitésParActivité = ({ graphiqueCapacitésParActivitéViewModel }: GraphiqueCapacitésParActivitéProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(graphiqueCapacitésParActivitéViewModel.annéeInitiale);

  const annees = graphiqueCapacitésParActivitéViewModel.filtrerLesAnnéesAvecDesCapacités();

  return (
    <IndicateurGraphique
      années={ListeDéroulanteDesAnnéesDesCapacités({ setAnnéeEnCours, annees })}
      contenuInfoBulle={
        <ContenuCapacitéParActivités
          dateDeMiseÀJour={graphiqueCapacitésParActivitéViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
          source={wording.SAE}
        />
      }
      dateDeMiseÀJour={graphiqueCapacitésParActivitéViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
      identifiant="capacite-sanitaire"
      nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
      source={wording.SAE}
    >
      {graphiqueCapacitésParActivitéViewModel.capacitéParActivités(annéeEnCours)}
    </IndicateurGraphique>
  );
};
