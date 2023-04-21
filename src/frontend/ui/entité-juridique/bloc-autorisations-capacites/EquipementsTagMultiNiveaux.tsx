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
    etablissements: [
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
  {
    numeroFiness: "570001222",
    nomEtablissement: "happy Hospital",
    etablissements: [
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
    etablissements: [
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
                etablissements={equipements.etablissements}
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

const EquipementEtablissement = ({ numeroFiness, nomEtablissement, etablissements }: EquipementEtablissement): ReactElement => {
  const { paths } = useDependencies();
  return (
    <li className={style["etablissement"]}>
      <Link className={style["etablissementFont"]} href={paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + numeroFiness}>
        {numeroFiness + " - " + nomEtablissement}
      </Link>{" "}
      ({etablissements.length} equipements)
      <ul id={`etablissement-accordion-${etablissements}`}>
        {etablissements.map((equipements, index) => {
          return <Autorisations autorisations={equipements.autorisations} key={`etablissement-${index}`} />;
        })}
      </ul>
    </li>
  );
};

const Autorisations = ({ autorisations }: Equipements): ReactElement => {
  let labelbulle = "";
  autorisations.map((autorisation) => {
    const nomEtValeur = autorisation.nom ? autorisation.valeur : "N/A";

    if (autorisations[autorisations.length - 1] !== autorisation) {
      labelbulle = labelbulle.concat(autorisation.nom + " : " + nomEtValeur + " | ");
    } else {
      labelbulle = labelbulle.concat(autorisation.nom + " : " + nomEtValeur);
    }
  });
  return (
    <li className={style["liste-etablissement"]}>
      <Tag key={labelbulle} label={labelbulle} size={TAG_SIZE.SM} />
    </li>
  );
};
