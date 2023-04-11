import { ReactElement } from "react";

import stylesBlocAutorisationsEtCapacités from "../../établissement-territorial-sanitaire/bloc-autorisations/BlocAutorisationEtCapacitéSanitaire.module.css";
import { BoutonLink } from "../Bouton/BoutonLink";
import { StringFormater } from "../StringFormater";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../Tag";

type TagCliquableProps = {
  entityJuridiqueAuth: {
    libellé: string;
    code: string;
    secondaryLabel: SecondaryLabel[];
  }[];
};

export type SecondaryLabel = {
  libellé: string;
  code: string;
  formDetails: FormDetails[];
};

export type FormDetails = {
  formName: {
    etablissementTerritorial: {
      numeroFiness: string;
      nom: string;
    };
    authorisation: {
      nom: string;
      value: string;
    }[];
  }[];
  libellé: string;
  code: string;
};

export const BalloonTags = ({ entityJuridiqueAuth }: TagCliquableProps): ReactElement => {
  // TODO rename variables
  // TODO Change Masquer ET to a bouton + make text dynamic
  // TODO BoutonLink needs to be reworked --> currently reusing what is inside TagCliquable, but with classname of buttons

  return (
    <ul aria-label="activités" className={`${stylesBlocAutorisationsEtCapacités["liste-activités"]}`}>
      {entityJuridiqueAuth.map((activité) => (
        <li key={`activité-${activité.code}`}>
          <TagCliquable for={`autresActivités-accordion-${activité.code}`} titre={`${activité.libellé} [${activité.code}]`} />
          <ul className=" fr-collapse niveau1" id={`autresActivités-accordion-${activité.code}`}>
            {activité.secondaryLabel.map((modalité) => (
              <li key={`modalité-${modalité.code}`}>
                <TagCliquable
                  for={`autorisations-accordion-${activité.code}-${modalité.code}`}
                  texteGras={false}
                  titre={`${modalité.libellé} [${modalité.code}]`}
                />
                <ul className="fr-collapse niveau2" id={`autorisations-accordion-${activité.code}-${modalité.code}`}>
                  {modalité.formDetails.map((forme) => {
                    return (
                      <li key={`modalité-${forme.code}`}>
                        <Tag label={`${forme.libellé} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
                        <BoutonLink for={`autorisations-accordion-${modalité.code}-${forme.code}`} titre="ET" />
                        <ul className="fr-collapse niveau3" id={`autorisations-accordion-${modalité.code}-${forme.code}`}>
                          {forme.formName.map((details) => {
                            return (
                              <li key={`details-${details.etablissementTerritorial.numeroFiness}`}>
                                <p>{details.etablissementTerritorial.numeroFiness + " - " + details.etablissementTerritorial.nom}</p>
                                <TagGroup label="authorisation">
                                  {details.authorisation.map((auth) => {
                                    return (
                                      <Tag
                                        key={auth.nom}
                                        label={`${auth.nom} : ${auth.nom ? StringFormater.formateLaDate(auth.value) : "N/A"}`}
                                        // TODO move the string formatter to outside the component
                                        size={TAG_SIZE.SM}
                                      />
                                    );
                                  })}
                                </TagGroup>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
