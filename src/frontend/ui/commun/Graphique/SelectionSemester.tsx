import { ChangeEvent } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { Select } from "../Select/Select";

type listeDeroulanteMoisProps = {
  setSemester: (value: string) => void;
  id?: string;
};

export const SelectionSemester = ({ setSemester, id }: listeDeroulanteMoisProps) => {
  const { wording } = useDependencies();
  const listeDesSemester = ["premier semestre", "deuxième semestre"];

  if (listeDesSemester.length > 0) {
    return (
      <Select
        id={id}
        label={wording.MOIS}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          setSemester(event.target.value);
        }}
        options={listeDesSemester}
      />
    );
  }

  return <></>;
};
