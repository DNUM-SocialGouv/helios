import { ReactNode } from "react";
import "@gouvfr/dsfr/dist/component/highlight/highlight.min.css";

import styles from "./MiseEnExergue.module.css";

type MiseEnExergueProps = Readonly<{
  children: ReactNode;
}>;

export const MiseEnExergue = ({ children }: MiseEnExergueProps) => {
  return (
    <div className="fr-highlight">
      <p className={styles["mise-en-exergue"]}>{children}</p>
    </div>
  );
};
