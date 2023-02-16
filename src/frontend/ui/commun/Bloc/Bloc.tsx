import { ReactChild } from "react";

import styles from "./Bloc.module.css";

type BlocProps = Readonly<{
  children?: ReactChild | ReactChild[];
  isMain?: boolean;
  titre: string;
  isExpandable?: boolean;
}>;

export const Bloc = ({ children, isMain = false, titre, isExpandable = true }: BlocProps) => {
  const contenuBloc = isMain ? styles["contenu-bloc-main"] : styles["contenu-bloc"];
  const classeDuTitre = isMain ? styles["titre-bloc-main"] : styles["titre-bloc-secondary"];
  const classesContent = (isExpandable ? "fr-collapse " : "") + contenuBloc;
  const contentId = "accordion-" + titre;

  return (
    <section aria-label={titre}>
      {isExpandable ? (
        <h2 className={styles["titre-bloc"]}>
          <button aria-controls={contentId} aria-expanded="true" className={"fr-accordion__btn " + styles["titre-button-bloc"] + " " + classeDuTitre}>
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
