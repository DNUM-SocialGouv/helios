import { ReactElement } from "react";

import stylesBlocAutorisationsEtCapacités from "../../établissement-territorial-sanitaire/bloc-autorisations/BlocAutorisationEtCapacitéSanitaire.module.css";
import { BoutonLink } from "../Bouton/BoutonLink";
import { StringFormater } from "../StringFormater";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../Tag";

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

export const TagMultiNiveaux = ({ activites }: TagMultiNiveauxProps): ReactElement => {
  // TODO Change Masquer ET to a bouton + make text dynamic
  // TODO BoutonLink needs to be reworked --> currently reusing what is inside TagCliquable, but with classname of buttons

  return (
    <ul className={`${stylesBlocAutorisationsEtCapacités["liste-activités"]}`}>
      {activites.map((activité) => (
        <li key={`activité-${activité.code}`}>
          <TagCliquable for={`autresActivités-accordion-${activité.code}`} titre={`${activité.libelle} [${activité.code}]`} />
          <ul className=" fr-collapse niveau1" id={`autresActivités-accordion-${activité.code}`}>
            {activité.modalites.map((modalité) => (
              <li key={`modalité-${modalité.code}`}>
                <TagCliquable
                  for={`autorisations-accordion-${activité.code}-${modalité.code}`}
                  texteGras={false}
                  titre={`${modalité.libelle} [${modalité.code}]`}
                />
                <ul className="fr-collapse niveau2" id={`autorisations-accordion-${activité.code}-${modalité.code}`}>
                  {modalité.forme.map((forme) => (
                    <Modalites codeModalite={modalité.code} forme={forme} key={`forme-${forme.code}`} />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

const Modalites = ({ codeModalite, forme }: { codeModalite: string; forme: Forme }): ReactElement => {
  return (
    <li>
      <Tag label={`${forme.libelle} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
      <BoutonLink for={`autorisations-accordion-${codeModalite}-${forme.code}`} titre="ET" />
      <ul className="fr-collapse niveau3" id={`autorisations-accordion-${codeModalite}-${forme.code}`}>
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
  return (
    <li>
      <p>{etablissementTerritorial.numeroFiness + " - " + etablissementTerritorial.nom}</p>
      <TagGroup label="authorisation">
        {autorisations.map((autorisation) => {
          return (
            <Tag
              key={autorisation.nom}
              label={`${autorisation.nom} : ${autorisation.nom ? StringFormater.formatDate(autorisation.valeur) : "N/A"}`}
              // TODO move the string formatter to outside the component
              size={TAG_SIZE.SM}
            />
          );
        })}
      </TagGroup>
    </li>
  );
};
