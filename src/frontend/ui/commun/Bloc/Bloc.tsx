import { ReactChild } from "react";

import styles from "./Bloc.module.css";

type BlocProps = Readonly<{
  children?: ReactChild | ReactChild[];
  isMain?: boolean;
  titre: string;
  isExpandable?: boolean;
}>;

export const Bloc = ({ children, isMain = false, titre, isExpandable = true }: BlocProps) => {
  const classeDuTitre = isMain ? styles["titre-bloc-main"] : styles["titre-bloc-secondary"];
  const classesContent = (isExpandable ? "fr-collapse " : "") + styles["contenu-bloc"];
  const contentId = "accordion-" + titre;

  return (
    <section>
      {isExpandable ? (
        <h2 className={styles["titre-bloc"]}>
          <button aria-controls={contentId} aria-expanded="true" className={styles["titre-button-bloc"] + " " + classeDuTitre}>
            {titre}
          </button>
        </h2>
      ) : (
        <h2 className={styles["titre-bloc"] + " " + classeDuTitre}>{titre}</h2>
      )}
      <div className={classesContent} id={contentId}>
        {children}
      </div>
    </section>
  );
};
