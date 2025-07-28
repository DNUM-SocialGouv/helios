import Link from "next/link";
import { ReactElement } from "react";

import style from "./EquipementsTagMultiNiveaux.module.css";
import {
  EquipementEtablissement as EquipementEtablissementType,
  EquipementLourds,
  Equipements,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { Tag, TAG_SIZE, TagCliquable } from "../../commun/Tag";

export type EquipementsProps = {
  equipementLourds: EquipementLourds[];
};

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

const EquipementEtablissement = ({ numeroFiness, nomEtablissement, equipements }: EquipementEtablissementType): ReactElement => {
  const { paths } = useDependencies();
  return (
    <li className={style["etablissement"]}>
      <div>
        <Link href={paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + numeroFiness}>{numeroFiness + " - " + nomEtablissement}</Link>
        &nbsp;&nbsp;
        {equipements.length > 1 ? <p className={style["nombre-equipement"]}>({equipements.length} équipements)</p> : null}
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
    <li className={style["list-equipement"]}>
      <Tag isComposedTag={style["list-equipement"]} size={TAG_SIZE.SM}>
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
