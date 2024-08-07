import { ChangeEvent } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { Select } from "../Select/Select";

type listeDeroulanteAnneesProps = {
  setAnnéeEnCours: (value: number) => void;
  annees: string[] | number[];
  id?: string;
  prefix?: string;
};

export const SelectionAnnee = ({ setAnnéeEnCours, annees, id, prefix}: listeDeroulanteAnneesProps) => {
  const { wording } = useDependencies();
  let anneesTriees = annees.sort((année1, année2) => (année2 as number) - (année1 as number));

  if(prefix && prefix.length > 0)
  {
    anneesTriees = annees.map(item => prefix + ' ' + item)
  }

  if (anneesTriees.length > 0) {
    return (
      <Select
        id={id}
        label={wording.ANNÉE}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {

          if(prefix && prefix.length > 0)
          {
            setAnnéeEnCours(Number(event.target.value.slice(prefix.length+1)));
          }
          else
          {
            setAnnéeEnCours(Number(event.target.value));
          }
        }}
        options={anneesTriees}
      />
    );
  }

  return <></>;
};
