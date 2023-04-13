import Link from "next/link";
import { ReactElement, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../../commun/Tag";
import style from "./AutorisationsTagMultiNiveaux.module.css";

export type TagMultiNiveauxProps = {
  activites: Activite[];
};

type Activite = {
  libelle: string;
  code: string;
  modalites: Modalite[];
};

export type Modalite = {
  libelle: string;
  code: string;
  forme: Forme[];
};

type AutorisationEtablissement = {
  etablissementTerritorial: {
    numeroFiness: string;
    nom: string;
  };
  autorisations: {
    nom: string;
    valeur: string;
  }[];
};

export type Forme = {
  nom: AutorisationEtablissement[];
  libelle: string;
  code: string;
};

const mockFormDetails: Forme[] = [
  {
    libelle: "label 3",
    code: "03",
    nom: [
      {
        etablissementTerritorial: {
          numeroFiness: "570001057",
          nom: "amazing Hospital",
        },
        autorisations: [
          {
            nom: "dateDAutorisation",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
        ],
      },
      {
        etablissementTerritorial: {
          numeroFiness: "570001057",
          nom: "rainbow Hospital",
        },
        autorisations: [
          {
            nom: "dateDAutorisation",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
        ],
      },
    ],
  },
];

const mockFormDetails2: Forme[] = [
  {
    libelle: "label 3",
    code: "05",
    nom: [
      {
        etablissementTerritorial: {
          numeroFiness: "570001057",
          nom: "regular Hospital",
        },
        autorisations: [
          {
            nom: "dateDAutorisation",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre",
            valeur: "13/05/2025",
          },
        ],
      },
    ],
  },
];

const mockSecondaryLabel: Modalite[] = [
  {
    libelle: "secondLabel",
    code: "99",
    forme: mockFormDetails,
  },
];

const mockSecondaryLabel2: Modalite[] = [
  {
    libelle: "secondLabel",
    code: "55",
    forme: mockFormDetails2,
  },
];

const mockPrimaryLabel = [
  {
    libelle: "label",
    code: "01",
    modalites: mockSecondaryLabel,
  },
  {
    libelle: "label2",
    code: "02",
    modalites: mockSecondaryLabel2,
  },
];

export const TagMultiNiveauxMock = () => {
  return <AutorisationsTagMultiNiveaux activites={mockPrimaryLabel} />;
};

export const AutorisationsTagMultiNiveaux = ({ activites }: TagMultiNiveauxProps): ReactElement => {
  return (
    <ul>
      {activites.map((activité) => (
        <li key={`activité-${activité.code}`}>
          <TagCliquable for={`autresActivités-accordion-${activité.code}`} titre={`${activité.libelle} [${activité.code}]`} />
          <ul className="fr-collapse niveau1" id={`autresActivités-accordion-${activité.code}`}>
            {activité.modalites.map((modalité) => (
              <Modalite codeActivite={activité.code} key={`modalité-${modalité.code}`} modalité={modalité} />
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
      <ul className="fr-collapse niveau2" id={`autorisations-accordion-${codeActivite}-${modalité.code}`}>
        {modalité.forme.map((forme) => (
          <Forme codeModalite={modalité.code} forme={forme} key={`forme-${forme.code}`} />
        ))}
      </ul>
    </li>
  );
};
const Forme = ({ codeModalite, forme }: { codeModalite: string; forme: Forme }): ReactElement => {
  return (
    <li>
      <Tag label={`${forme.libelle} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
      <AfficherLesEt for={`autorisations-accordion-${codeModalite}-${forme.code}`} />
      <ul className={"fr-collapse niveau3" + style["liste-etablissements"]} id={`autorisations-accordion-${codeModalite}-${forme.code}`}>
        {forme.nom.map((autorisationEtablissement) => (
          <AutorisationEtablissement
            autorisations={autorisationEtablissement.autorisations}
            etablissementTerritorial={autorisationEtablissement.etablissementTerritorial}
            key={`details-${autorisationEtablissement.etablissementTerritorial.numeroFiness}`}
          />
        ))}
      </ul>
    </li>
  );
};

const AutorisationEtablissement = ({ etablissementTerritorial, autorisations }: AutorisationEtablissement): ReactElement => {
  const { paths } = useDependencies();
  return (
    <li className={style["etablissement"]}>
      <Link href={paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + etablissementTerritorial.numeroFiness}>
        {etablissementTerritorial.numeroFiness + " - " + etablissementTerritorial.nom}
      </Link>
      <TagGroup label="autorisations">
        {autorisations.map((autorisation) => {
          return <Tag key={autorisation.nom} label={`${autorisation.nom} : ${autorisation.nom ? autorisation.valeur : "N/A"}`} size={TAG_SIZE.SM} />;
        })}
      </TagGroup>
    </li>
  );
};
