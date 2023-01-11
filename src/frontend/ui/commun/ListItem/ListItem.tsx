import Link from "next/link";
import { ReactChild } from "react";

import styles from "./ListItem.module.css";

type ListItemProps = Readonly<{
  label: ReactChild;
  lien: string;
  logo: ReactChild;
}>;

export const ListItem = ({ label, lien, logo }: ListItemProps) => {
  return (
    <li className={styles["élément-liste"]}>
      {logo}
      <Link href={lien} passHref prefetch={false}>
        {label}
      </Link>
    </li>
  );
};
