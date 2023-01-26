import Link from "next/link";
import { ReactChild, useCallback } from "react";

import styles from "./ListItem.module.css";

type ListItemProps = Readonly<{
  hasFocus?: boolean;
  label: ReactChild;
  lien: string;
  logo?: ReactChild;
}>;

export const ListItem = ({ label, lien, logo, hasFocus }: ListItemProps) => {
  const ref = useCallback((link: HTMLAnchorElement) => {
    if (link && hasFocus) {
      link.focus();
    }
  }, []);

  return (
    <li className={styles["élément-liste"]}>
      {logo}
      <Link href={lien} passHref prefetch={false} ref={ref}>
        {label}
      </Link>
    </li>
  );
};
