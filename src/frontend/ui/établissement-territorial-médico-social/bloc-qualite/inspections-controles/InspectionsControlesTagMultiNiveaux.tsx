import { ReactElement, useState } from "react";

import { InspectionControleData, InspectionControleDataTheme } from "../../../../../backend/métier/entities/ÉtablissementTerritorialQualite";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { TagCliquable } from "../../../commun/Tag";
import { CardInspectionControle } from "./card-inspection-controle/CardInspectionControle";
import styles from "./InspectionsControlesTagMultiNiveaux.module.css";

export const InspectionsControlesRow = ({ row, libelleTheme }: { row: InspectionControleData[]; libelleTheme: string }): ReactElement => {
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
                  <button className="fr-btn fr-btn--secondary" name="Afficher plus" onClick={() => setReadMore(true)} title="Afficher plus" type="button">
                    Afficher plus
                  </button>
                )}
                {readMore && (
                  <button className="fr-btn fr-btn--secondary" name="Afficher moins" onClick={() => setReadMore(false)} title="Afficher moins" type="button">
                    Afficher moins
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

export const InspectionsControlesTagMultiNiveaux = ({ data }: InspectionsControlesTagMultiNiveauxProps): ReactElement => {
  const { wording } = useDependencies();

  return (
    <>
      {data.map((item) => (
        <li key={`li-${item.libelleTheme}`}>
          <TagCliquable colorTiltle="blue" for={`istn-accordion-${item.libelleTheme}`} titre={`Type de mission : ${item.libelleTheme} [${item.data.length}]`} />
          item.libelleTheme : {item.libelleTheme}
          {item.data && item.data.length > 0 && <InspectionsControlesRow libelleTheme={item.libelleTheme} row={item.data} />}
        </li>
      ))}
    </>
  );
};
