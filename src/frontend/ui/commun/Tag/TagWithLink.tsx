import { useState } from "react";

import styles from "./TagWithLink.module.css";

type TagWithLinkProps = Readonly<{
    titre: string;
    for: string;
}>;

type AfficherLesDetailsProps = Readonly<{ for: string }>;
const AfficherLesDetails = ({ for: identifiant }: AfficherLesDetailsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const textDisplay = isOpen ? `Masquer le détail` : `Afficher le détail`;

    return (
        <button
            aria-controls={identifiant}
            aria-expanded={isOpen}
            className={"fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-right " + (isOpen ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")}
            data-fr-opened={isOpen}
            onClick={() => {
                setIsOpen(!isOpen);
            }}
        >
            {textDisplay}
        </button>
    );
};

export const TagWithLink = ({ for: identifiant, titre }: TagWithLinkProps) => {
    return (
        <div className="fr-mb-1w">
            <div
                className={`fr-tag fr-text-label--grey ` + styles["accordion"]}
            >
                {titre}
            </div>
            <AfficherLesDetails for={identifiant} />
        </div>
    );
};