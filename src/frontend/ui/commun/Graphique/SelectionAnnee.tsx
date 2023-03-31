import { ChangeEvent } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { Select } from "../Select/Select";

type listeDeroulanteAnneesProps = {
  setAnnéeEnCours: (value: number) => void;
  annees: number[];
};

export const SelectionAnnee = ({ setAnnéeEnCours, annees }: listeDeroulanteAnneesProps) => {
  const { wording } = useDependencies();
  const anneesTriees = annees.sort((année1, année2) => année2 - année1);

  if (anneesTriees.length > 0) {
    return (
      <Select
        label={wording.ANNÉE}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          setAnnéeEnCours(Number(event.target.value));
        }}
        options={anneesTriees}
      />
    );
  }

  return <></>;
};
