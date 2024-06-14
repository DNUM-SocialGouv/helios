import { ChangeEvent } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { Select } from "../Select/Select";

type listeDeroulanteMoisProps = {
  setMoisDeDébut: (value: string) => void;
  id?: string;
};

export const SelectionMois = ({ setMoisDeDébut, id }: listeDeroulanteMoisProps) => {
  const { wording } = useDependencies();
  const listeDesMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  if (listeDesMois.length > 0) {
    return (
      <Select
        id={id}
        label={wording.MOIS}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          setMoisDeDébut(event.target.value);
        }}
        options={listeDesMois}
      />
    );
  }

  return <></>;
};
