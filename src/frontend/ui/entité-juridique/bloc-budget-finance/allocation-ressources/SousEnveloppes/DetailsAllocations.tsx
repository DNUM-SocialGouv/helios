import { ReactElement, useState } from "react";

import { IEnveloppe } from "../../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAllocationRessources";
import {
  HistogrammeHorizontalRowMultiple,
  colorsAllocations,
} from "../../../../indicateur-métier/qualite/ReclamationsParAnnee/HistogrammeHorizontalRowMultiple/HistogrammeHorizontalRowMultiple";
import styles from "./DetailsAllocations.module.css";
import { useDependencies } from "../../../../commun/contexts/useDependencies";

type ShowDetailsTitleProps = Readonly<{ for: string; children: ReactElement; direction?: string }>;
const ShowDetailsTitle = ({ for: identifiant, children, direction = "right" }: ShowDetailsTitleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
<span
  aria-controls={identifiant}
  aria-expanded={isOpen}
  className={
    styles["titleDetails"] +
    " fr-btn-NO fr-btn--sm-NO fr-btn--tertiary-no-outline-NO fr-btn--icon-" +
    direction +
    (isOpen ? " fr-icon-arrow-up-s-line" : " fr-icon-arrow-down-s-line")
  }
  data-fr-opened={isOpen}
  icon-direction={direction}
  onClick={() => {
    setIsOpen(!isOpen);
  }}
  onKeyDown={() => {}} 
  role="button"
  tabIndex={0}
>
  {children}
</span>

  );
};

type ShowDetailsProps = Readonly<{ dataTitle: ReactElement; children: any; id: string; className: string; dataName?: string; directionIcone?: string }>;
const ShowDetails = ({ dataTitle, children, id, className, dataName, directionIcone = "right" }: ShowDetailsProps) => {
  return (
    <div className={className}>
      <div className={styles["envTitle"]}>{dataName}</div>
      <div className={styles["envContent"]}>
        <ShowDetailsTitle direction={directionIcone} for={id}>
          {dataTitle}
        </ShowDetailsTitle>
        <ul className="fr-collapse niveau3" id={id}>
          {children}
        </ul>
      </div>
    </div>
  );
};
 
type DetailsAllocationsProps = Readonly<{
  data: IEnveloppe[];
}>;

export function DetailsAllocations({ data }: DetailsAllocationsProps) {
  const { wording } = useDependencies();

  return (
    <div className={styles['bigContainer']}>
      <div className={styles['repBigTitle']}>{wording.REPARTITION_DES_SOUS_ENVELOPPES}</div>

      {data.map((enveloppe) => (
        <ShowDetails
          className={styles["envContainer"]}
          dataName={`Enveloppe ${enveloppe.enveloppe}`}
          dataTitle={
            <div className={styles["titleDetails"]}>
              <HistogrammeHorizontalRowMultiple
                data={enveloppe.sousEnveloppes.map((sousEnveloppe) => ({ key: sousEnveloppe.sousEnveloppe, value: sousEnveloppe.pourcentage }))}
                realPercentage={enveloppe.pourcentage}
              />
              <span className={styles["envTotal"]}>{enveloppe.total}€</span>
            </div>
          }
          directionIcone="left"
          id={enveloppe.enveloppe}
          key={enveloppe.enveloppe}
        >
          {enveloppe.sousEnveloppes.map((sousEnveloppe, index) => (
            <ShowDetails
              className={styles["subEnvContainer"]}
              dataTitle={
                <>
                  <div className={styles["carreSousEnveloppe"]} style={{ backgroundColor: colorsAllocations[index], color: colorsAllocations[index] }}>
                    i
                  </div>
                  <span className={styles["subEnvTitle"]}>
                    Sous enveloppe {sousEnveloppe.sousEnveloppe}{" "}
                    <span className={styles["totalSousEnveloppe"]}>
                      {" "}
                      {sousEnveloppe.total}€ ({sousEnveloppe.pourcentage}%){" "}
                    </span>{" "}
                  </span>
                </>
              }
              id={enveloppe.enveloppe + sousEnveloppe.sousEnveloppe}
              key={sousEnveloppe.sousEnveloppe}
            >
              <div className={styles["modesDeDelegationContainer"]}>
                {sousEnveloppe.modesDeDélégation.map((mode) => (
                  <div className={styles["modesDeDelegationItem"]} key={mode.modeDeDélégation}>
                    {mode.modeDeDélégation} : {mode.montantNotifié} ({mode.pourcentage} %)
                  </div>
                ))}
        
              </div>
            </ShowDetails>
          ))}
        </ShowDetails>
      ))}
    </div>
  );
}
