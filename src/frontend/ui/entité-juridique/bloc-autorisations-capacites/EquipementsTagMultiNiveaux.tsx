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
  equipementLourds: EquipementLourds[];
};

export const EquipementsTagMultiniveauxMock = () => {
  return <EquipementsTagMultiniveaux equipementLourds={blah} />;
};

const blah = [
  {
    equipementEtablissements: [
      {
        numeroFiness: "010005239",
        nomEtablissement: "CH DU HAUT BUGEY - GEOVREISSET",
        equipements: [
          {
            autorisations: [
              {
                nom: "Numéro ARHGOS",
                valeur: "01-00-0000",
              },
              {
                nom: "Date d'autorisation",
                valeur: "06/11/2007",
              },
              {
                nom: "Date de mis en oeuvre",
                valeur: "19/10/2011",
              },
              {
                nom: "Date de fin",
                valeur: "01/01/2029",
              },
            ],
          },
        ],
      },
    ],
    libelle: "Scanographe à utilisation médicale",
    code: "05602",
  },
  {
    equipementEtablissements: [
      {
        numeroFiness: "010786259",
        nomEtablissement: "USLD CH DE NANTUA",
        equipements: [
          {
            autorisations: [
              {
                nom: "Numéro ARHGOS",
                valeur: "02-00-0000",
              },
              {
                nom: "Date d'autorisation",
                valeur: "N/A",
              },
              {
                nom: "Date de mis en oeuvre",
                valeur: "N/A",
              },
              {
                nom: "Date de fin",
                valeur: "N/A",
              },
            ],
          },
        ],
      },
    ],
    libelle: "Caméra à scintillation sans détecteur d'émission de positons",
    code: "05701",
  },
  {
    equipementEtablissements: [
      {
        numeroFiness: "010005239",
        nomEtablissement: "CH DU HAUT BUGEY - GEOVREISSET",
        equipements: [
          {
            autorisations: [
              {
                nom: "Numéro ARHGOS",
                valeur: "01-00-0001",
              },
              {
                nom: "Date d'autorisation",
                valeur: "02/05/2006",
              },
              {
                nom: "Date de mis en oeuvre",
                valeur: "20/01/2009",
              },
              {
                nom: "Date de fin",
                valeur: "16/02/2027",
              },
            ],
          },
        ],
      },
    ],
    libelle: "Appareil d'IRM à utilisation clinique",
    code: "06201",
  },
] as EquipementLourds[];
export const EquipementsTagMultiniveaux = ({ equipementLourds }: EquipementsProps): ReactElement => {
  return (
    <ul>
      {equipementLourds.map((equipementLourd) => (
        <li key={`equipementlourd-${equipementLourd.code}`}>
          <TagCliquable for={`equipementlourds-accordion-${equipementLourd.code}`} titre={`${equipementLourd.libelle} [${equipementLourd.code}]`} />
          <ul className="fr-collapse niveau1" id={`equipementlourds-accordion-${equipementLourd.code}`}>
            {equipementLourd.equipementEtablissements.map((equipements) => (
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
