import Link from "next/link";
import { ReactElement } from "react";

import {
  EquipementEtablissement,
  EquipementLourds,
  Equipements,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { Tag, TAG_SIZE, TagCliquable } from "../../commun/Tag";
import style from "./EquipementsTagMultiNiveaux.module.css";

export type EquipementsProps = {
  activites: EquipementLourds[];
};

const mockEquipementEtab1: EquipementEtablissement[] = [
  {
    numeroFiness: "570001057",
    nomEtablissement: "amazing Hospital",
    equipements: [
      {
        autorisations: [
          {
            nom: "dateDAutorisation1",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin1",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre1",
            valeur: "13/05/2025",
          },
        ],
      },
    ],
  },
  {
    numeroFiness: "570001222",
    nomEtablissement: "happy Hospital",
    equipements: [
      {
        autorisations: [
          {
            nom: "dateDAutorisation1",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin1",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre1",
            valeur: "13/05/2025",
          },
        ],
      },
      {
        autorisations: [
          {
            nom: "dateDAutorisation2",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin2",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre2",
            valeur: "13/05/2025",
          },
        ],
      },
    ],
  },
];

const mockEquipementEtab2: EquipementEtablissement[] = [
  {
    numeroFiness: "570001057",
    nomEtablissement: "normal Hospital",
    equipements: [
      {
        autorisations: [
          {
            nom: "dateDAutorisation1",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin1",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre1",
            valeur: "13/05/2025",
          },
          {
            nom: "autre Date",
            valeur: "13/05/2025",
          },
        ],
      },
      {
        autorisations: [
          {
            nom: "dateDAutorisation2",
            valeur: "10/02/2020",
          },
          {
            nom: "dateDeFin2",
            valeur: "10/10/2023",
          },
          {
            nom: "dateDeMiseEnOeuvre2",
            valeur: "13/05/2025",
          },
        ],
      },
    ],
  },
];

const mockPrimaryLabel = [
  {
    libelle: "label",
    code: "01",
    equipementEtablissements: mockEquipementEtab1,
  },
  {
    libelle: "label2",
    code: "02",
    equipementEtablissements: mockEquipementEtab2,
  },
];

export const EquipementsTagMultiniveauxMock = () => {
  return <EquipementsTagMultiniveaux activites={mockPrimaryLabel} />;
};

export const EquipementsTagMultiniveaux = ({ activites }: EquipementsProps): ReactElement => {
  return (
    <ul>
      {activites.map((activité) => (
        <li key={`activité-${activité.code}`}>
          <TagCliquable for={`equipementlourds-accordion-${activité.code}`} titre={`${activité.libelle} [${activité.code}]`} />
          <ul className="fr-collapse niveau1" id={`equipementlourds-accordion-${activité.code}`}>
            {activité.equipementEtablissements.map((equipements) => (
              <EquipementEtablissement
                equipements={equipements.equipements}
                key={`details-${equipements.numeroFiness}`}
                nomEtablissement={equipements.nomEtablissement}
                numeroFiness={equipements.numeroFiness}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

const EquipementEtablissement = ({ numeroFiness, nomEtablissement, equipements }: EquipementEtablissement): ReactElement => {
  const { paths } = useDependencies();
  return (
    <li className={style["etablissement"]}>
      <div>
        <Link className={style["etablissementFont"]} href={paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + numeroFiness}>
          {numeroFiness + " - " + nomEtablissement}
        </Link>
        &nbsp;&nbsp;
        {equipements.length > 1 ? <p className={style["nombre-equipement"] + " " + style["etablissementFont"]}>({equipements.length} équipements)</p> : null}
      </div>
      <ul id={`etablissement-accordion-${equipements}`}>
        {equipements.map((equipements, index) => {
          return <Autorisations autorisations={equipements.autorisations} key={`etablissement-${index}`} />;
        })}
      </ul>
    </li>
  );
};

const Autorisations = ({ autorisations }: Equipements): ReactElement => {
  return (
    <li className={style["liste-etablissement"]}>
      <Tag size={TAG_SIZE.SM}>
        {autorisations.map((autorisation, index) => {
          const valeur = autorisation.nom ? autorisation.valeur : "N/A";
          return (
            <span key={autorisation.nom}>
              {autorisation.nom}&nbsp;:&nbsp;<span className="fr-text--bold">{valeur}</span>
              {autorisations.length - 1 === index ? "" : " |"}&nbsp;
            </span>
          );
        })}
      </Tag>
    </li>
  );
};
