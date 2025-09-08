import { ReactElement, useState, memo } from "react";

import CardInspectionControle from "./card-inspection-controle/CardInspectionControle";
import styles from "./InspectionsControlesTagMultiNiveaux.module.css";
import { Inspection, InspectionControleDataTheme } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { TagCliquable } from "../../../commun/Tag";

export const InspectionsControlesRow = ({ row, libelleTheme }: { row: Inspection[]; libelleTheme: string }): ReactElement => {
  const { wording } = useDependencies();
  const [readMore, setReadMore] = useState(false);

  return (
    <>
      {row && row.length > 0 && (
        <div className={`fr-collapse niveau1 fr-mb-2w `} id={`istn-accordion-${libelleTheme}`}>
          <div className={`${styles["cardsContainer"]}`}>
            {row.slice(0, 6).map((card) => (
              <CardInspectionControle data={card} key={`${libelleTheme}-${card.themeRegional}`} />
            ))}

            {row.length > 6 && readMore && row.slice(6).map((card) => <CardInspectionControle data={card} key={`${libelleTheme}-${card.themeRegional}`} />)}

            {row.length > 6 && (
              <div className={`${styles["readMoreContainer"]}`}>
                {!readMore && (
                  <button
                    className="fr-btn fr-btn--secondary"
                    name={wording.AFFICHER_PLUS}
                    onClick={() => setReadMore(true)}
                    title={wording.AFFICHER_PLUS}
                    type="button"
                  >
                    {wording.AFFICHER_PLUS}
                  </button>
                )}
                {readMore && (
                  <button
                    className="fr-btn fr-btn--secondary"
                    name={wording.AFFICHER_MOINS}
                    onClick={() => setReadMore(false)}
                    title={wording.AFFICHER_MOINS}
                    type="button"
                  >
                    {wording.AFFICHER_MOINS}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

type InspectionsControlesTagMultiNiveauxProps = {
  data: InspectionControleDataTheme[];
};

  const InspectionsControlesTagMultiNiveaux = ({ data }: InspectionsControlesTagMultiNiveauxProps): ReactElement => {
  const { wording } = useDependencies();

  return (
    <>
      {data.map((item) => (
        <div key={`li-${item.libelleTheme}`}>
          <TagCliquable
            colorTiltle="blue"
            for={`istn-accordion-${item.libelleTheme}`}
            titre={`${wording.TYPE_DE_MISSION} : ${item.libelleTheme} [${item.data.length}]`}
          />
          {item.data && item.data.length > 0 && <InspectionsControlesRow libelleTheme={item.libelleTheme} row={item.data} />}
        </div>
      ))}
    </>
  );
};

export default memo(InspectionsControlesTagMultiNiveaux);