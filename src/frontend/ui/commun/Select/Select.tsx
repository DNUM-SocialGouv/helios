import { ChangeEventHandler, ReactNode } from "react";

import styles from "./Select.module.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";

type SelectProps = Readonly<{
  label: ReactNode;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: (number | string)[];
  id?: string;
}>;

export const Select = ({ label, onChange, options, id }: SelectProps) => {
  return (
    <span className={"fr-select-group " + styles["années"]}>
      <label className={styles["invisible"]} htmlFor={"select" + label}>
        {label}
      </label>
      <select className="fr-select" id={"select" + id} name="select" onChange={onChange}>
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </span>
  );
};
