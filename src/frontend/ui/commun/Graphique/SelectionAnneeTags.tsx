import { useState } from "react";

import styles from "./SelectionAnneeTag.module.css";

type listeAnneesTagsProps = {
  setAnnéeEnCours: (value: number) => void;
  annees: string[] | number[];
  id?: string;
  prefix?: string;
};



export const SelectionAnneeTags = ({ setAnnéeEnCours, annees, id, prefix }: listeAnneesTagsProps) => {
  let anneesTriees = annees.sort((année1, année2) => (année1 as number) - (année2 as number));
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (prefix && prefix.length > 0) {
    anneesTriees = annees.map(item => prefix + ' ' + item)
  }

  if (anneesTriees.length > 0) {
    return (
      <ul className="fr-tags-group" id={id}>
        {anneesTriees.map((annee, index) => (
          <li data-testid="groupe-annees" key={index}>
            <button
              className={`fr-tag ${selectedIndex === index ? styles["tag-active"] : ""}`}
              onClick={() => {
                setSelectedIndex(index);
                if (prefix && prefix.length > 0) {
                  setAnnéeEnCours(Number(("" + annee).slice(prefix.length + 1)));
                }
                else {
                  setAnnéeEnCours(Number(annee));
                }
              }}
            >{annee}</button >
          </li>
        ))}
      </ul>
    );
  }

  return <></>;
};
