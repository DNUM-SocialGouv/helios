import Link from "next/link";
import { ReactElement } from "react";

import styles from "./TagCliquable.module.css";

type ActionneurDAccordéonProps = Readonly<{
  for: string;
  texteGras?: boolean;
  titre: string;
  colorTiltle?: string;
}>;

export const TagCliquable = ({ for: identifiant, titre, texteGras = true, colorTiltle = "" }: ActionneurDAccordéonProps) => {
  return (
    <Link
      aria-controls={identifiant}
      aria-expanded="false"
      className={
        `fr-tag ${colorTiltle === "blue" ? "fr-text-label-blue-france" : "fr-text-label--grey"}  ${texteGras ? "fr-text--bold" : ""} ` +
        styles["tag-actionnable"]
      }
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
