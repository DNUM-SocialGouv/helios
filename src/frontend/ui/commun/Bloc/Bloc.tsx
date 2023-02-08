import { ReactChild } from "react";

import styles from "./Bloc.module.css";

type BlocProps = Readonly<{
  children?: ReactChild | ReactChild[];
  estCeIdentité?: boolean;
  titre: string;
}>;

export const Bloc = ({ children, estCeIdentité = false, titre }: BlocProps) => {
  const classeDuTitre = estCeIdentité ? styles["titre-bloc-identite"] : styles["titre-bloc-détail"];

  return (
    <section aria-label={titre}>
      <h2 className={styles["titre-bloc"] + " " + classeDuTitre}>
        <button aria-controls={"accordion-" + titre} aria-expanded="false" className={"fr-accordion__btn " + styles["titre-bloc"] + " " + classeDuTitre}>
          {titre}
        </button>
      </h2>
      <div className={"fr-collapse " + styles["contenu-bloc"]} id={"accordion-" + titre}>
        {children}
      </div>
    </section>
  );
};
