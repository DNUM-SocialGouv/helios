import Link from "next/link";
import { useState } from "react";

import styles from "./TagWithLink.module.css";

type TagWithLinkProps = Readonly<{
    titre: string;
    for: string;
}>;

export const TagWithLink = ({ for: identifiant, titre }: TagWithLinkProps) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="fr-mb-1w">
            <div
                className={`fr-tag fr-text-label--grey ` + styles["tag-green"]}
            >
                {titre}
            </div>
            <Link
                aria-controls={identifiant}
                aria-expanded="false"
                className={`fr-text--bold ` + styles["link-accordion"]}
                href="#"
                onClick={(event) => {
                    event.preventDefault();

                    setOpen(!open);
                }}
                passHref
            > {open ? 'Masquer le détail' : 'Afficher le détail '} </Link>
        </div>
    );
};