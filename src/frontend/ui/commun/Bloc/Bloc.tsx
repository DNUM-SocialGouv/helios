import { ReactNode } from "react";

import "@gouvfr/dsfr/dist/component/accordion/accordion.min.css";
import styles from "./Bloc.module.css";

type BlocProps = Readonly<{
  children?: ReactNode | ReactNode[];
  isMain?: boolean;
  titre: string;
  isExpandable?: boolean;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const Bloc = ({ children, isMain = false, titre, isExpandable = true, opnedBloc = false, toggelBlocs }: BlocProps) => {
  const contenuBloc = isMain ? styles["contenu-bloc-main"] : styles["contenu-bloc"];
  const classeDuTitre = isMain ? styles["titre-bloc-main"] : styles["titre-bloc-secondary"];
  const classesContent = (isExpandable ? "fr-collapse " : "") + contenuBloc;
  const contentId = "accordion-" + titre.toLowerCase().split(" ").join("_");

  return (
    <section aria-label={titre}>
      {isExpandable ? (
        <h2 className={styles["titre-bloc"]}>
          <button
            aria-controls={contentId}
            aria-expanded={opnedBloc}
            className={"fr-accordion__btn " + styles["titre-button-bloc"] + " " + classeDuTitre}
            onClick={() => { if (toggelBlocs) { toggelBlocs() } }}
          >
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
