import Link from "next/link";

type ActionneurDAccordéonProps = Readonly<{
  for: string;
  titre: string;
  isOpen?: boolean;
}>;
export const BoutonLink = ({ for: identifiant, titre }: ActionneurDAccordéonProps) => {
  const isOpen = false;
  let textDisplay = `Voir les ${titre} concernés`;

  if (isOpen) {
    textDisplay = `Masquer les ${titre} concernés`;
  }

  return (
    <Link
      aria-controls={identifiant}
      aria-expanded="false"
      className="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-right fr-icon-arrow-down-s-line"
      data-fr-opened={isOpen}
      href="#"
      onClick={(event) => {
        event.preventDefault();
      }}
      passHref
    >
      {textDisplay}
    </Link>
  );
};
