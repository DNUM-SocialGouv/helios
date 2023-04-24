import Link from "next/link";
import { ReactElement, useState } from "react";

import {
  AutorisationActivites,
  AutorisationEtablissement,
  Forme,
  Modalite,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../../commun/Tag";
import style from "./AutorisationsTagMultiNiveaux.module.css";

export type TagMultiNiveauxProps = {
  activites: AutorisationActivites[];
};

export const AutorisationsTagMultiNiveaux = ({ activites }: TagMultiNiveauxProps): ReactElement => {
  return (
    <ul>
      {activites.map((activité) => (
        <li key={`activité-${activité.code}`}>
          <TagCliquable for={`autresActivités-accordion-${activité.code}`} titre={`${activité.libelle} [${activité.code}]`} />
          <ul className="fr-collapse niveau1" id={`autresActivités-accordion-${activité.code}`}>
            {activité.modalites.map((modalités) => (
              <Modalite codeActivite={activité.code} key={`modalité-${modalités.code}`} modalité={modalités} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

type AfficherLesEtProps = Readonly<{ for: string }>;
const AfficherLesEt = ({ for: identifiant }: AfficherLesEtProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const textDisplay = isOpen ? `Masquer les ET concernés` : `Voir les ET concernés`;

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

const Modalite = ({ modalité, codeActivite }: { codeActivite: string; modalité: Modalite }): ReactElement => {
  return (
    <li>
      <TagCliquable for={`autorisations-accordion-${codeActivite}-${modalité.code}`} texteGras={false} titre={`${modalité.libelle} [${modalité.code}]`} />
      <ul className={"fr-collapse niveau2 " + style["modalites"]} id={`autorisations-accordion-${codeActivite}-${modalité.code}`}>
        {modalité.formes.map((forme) => (
          <Forme codeActivite={codeActivite} codeModalite={modalité.code} forme={forme} key={`forme-${forme.code}`} />
        ))}
      </ul>
    </li>
  );
};
const Forme = ({ codeModalite, forme, codeActivite }: { codeModalite: string; forme: Forme; codeActivite: string }): ReactElement => {
  return (
    <li>
      <Tag label={`${forme.libelle} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
      <AfficherLesEt for={`autorisations-accordion-${codeActivite}-${codeModalite}-${forme.code}`} />
      <ul className={"fr-collapse niveau3 " + style["liste-etablissements"]} id={`autorisations-accordion-${codeActivite}-${codeModalite}-${forme.code}`}>
        {forme.autorisationEtablissements.map((autorisationEtablissement) => (
          <AutorisationEtablissement
            autorisations={autorisationEtablissement.autorisations}
            key={`details-${autorisationEtablissement.numeroFiness}`}
            nomEtablissement={autorisationEtablissement.nomEtablissement}
            numeroFiness={autorisationEtablissement.numeroFiness}
          />
        ))}
      </ul>
    </li>
  );
};

const AutorisationEtablissement = ({ numeroFiness, nomEtablissement, autorisations }: AutorisationEtablissement): ReactElement => {
  const { paths } = useDependencies();
  return (
    <li className={style["etablissement"]}>
      <Link href={paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + numeroFiness}>{numeroFiness + " - " + nomEtablissement}</Link>
      <TagGroup label="autorisations">
        {autorisations.map((autorisation) => {
          return <Tag key={autorisation.nom} label={`${autorisation.nom} : ${autorisation.nom ? autorisation.valeur : "N/A"}`} size={TAG_SIZE.SM} />;
        })}
      </TagGroup>
    </li>
  );
};
