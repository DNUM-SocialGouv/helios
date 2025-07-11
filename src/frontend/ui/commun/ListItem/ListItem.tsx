import Link from "next/link";
import { ReactNode, useCallback } from "react";

import styles from "./ListItem.module.css";

type ListItemProps = Readonly<{
  hasFocus?: boolean;
  label: ReactNode;
  lien: string;
  logo?: ReactNode;
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
