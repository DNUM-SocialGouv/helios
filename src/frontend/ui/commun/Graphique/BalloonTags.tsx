import { ReactElement } from "react";

import stylesBlocAutorisationsEtCapacités from "../../établissement-territorial-sanitaire/bloc-autorisations/BlocAutorisationEtCapacitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
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
    name: string;
    value: string;
  }[];
  entityTerritorialNumber: string;
  libellé: string;
  code: string;
};
export const BalloonTags = ({ entityJuridiqueAuth }: TagCliquableProps): ReactElement => {
  const { wording } = useDependencies();
  // TODO rename variables
  // TODO make the Tags Dynamic

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
                    const details = new Map(forme.formName.map((i) => [i.name, i.value]));
                    return (
                      <>
                        <li key={`forme-${forme.code}`} />
                        <TagGroup label="autre-activité">
                          <Tag label={`${modalité.libellé} [${modalité.code}]`} size={TAG_SIZE.SM} withArrow />
                          <Tag
                            label={`${wording.DATE_D_AUTORISATION} : ${
                              details.get("dateDAutorisation") ? StringFormater.formateLaDate(details.get("dateDAutorisation")!) : "N/A"
                            }`}
                            size={TAG_SIZE.SM}
                          />
                          <Tag
                            label={`${wording.DATE_DE_MISE_EN_OEUVRE} : ${
                              details.get("dateDeMiseEnOeuvre") ? StringFormater.formateLaDate(details.get("dateDeMiseEnOeuvre")!) : "N/A"
                            }`}
                            size={TAG_SIZE.SM}
                          />
                          <Tag
                            label={`${wording.DATE_DE_FIN} : ${details.get("dateDeFin") ? StringFormater.formateLaDate(details.get("dateDeFin")!) : "N/A"}`}
                            size={TAG_SIZE.SM}
                          />
                        </TagGroup>
                      </>
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
