import Link from "next/link";

import styles from "./TagCliquable.module.css";

type ActionneurDAccordéonProps = Readonly<{
  for: string;
  texteGras?: boolean;
  titre: string;
  masquerET?: boolean;
}>;

export const TagCliquable = ({ for: identifiant, titre, texteGras = true, masquerET = false }: ActionneurDAccordéonProps) => {
  let className = `fr-tag fr-text-label--grey ${texteGras ? "fr-text--bold" : ""} ` + styles["tag-actionnable"];
  if (masquerET) {
    className = "fr-tag fr-tag--sm";
  }

  return (
    <Link
      aria-controls={identifiant}
      aria-expanded="false"
      className={className}
      href="#"
      onClick={(event) => {
        event.preventDefault();
      }}
      passHref
    >
      {titre}
    </Link>
  );
};
