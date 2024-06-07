import { ReactElement, useState } from "react";

import { IEnveloppe } from "../../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAllocationRessources";
import styles from "./DetailsAllocations.module.css";

type ShowDetailsTitleProps = Readonly<{ for: string; children: ReactElement }>;
const ShowDetailsTitle = ({ for: identifiant, children }: ShowDetailsTitleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      aria-controls={identifiant}
      aria-expanded={isOpen}
      className={ styles["titleDetails"] + " fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-right " + (isOpen ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")}
      data-fr-opened={isOpen}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      {children}
    </button>
  );
};

type ShowDetailsProps = Readonly<{ title: ReactElement; children: any; id: string; className: string }>;
const ShowDetails = ({ title, children, id, className }: ShowDetailsProps) => {
  return (
    <div className={className}>
      <ShowDetailsTitle for={id}>{title}</ShowDetailsTitle>
      <ul className="fr-collapse niveau3" id={id}>
        {children}
      </ul>
    </div>
  );
};

type DetailsAllocationsProps = Readonly<{
  data: IEnveloppe[];
}>;

export function DetailsAllocations({ data }: DetailsAllocationsProps) {
  return (
    <>
      {data.map((enveloppe) => (
        <ShowDetails
          className={styles["envContainer"]}
          id={enveloppe.enveloppe}
          key={enveloppe.enveloppe}
          title={
            <div className={styles["titleDetails"]}>
              {enveloppe.enveloppe}: {enveloppe.total}{" "}  == {enveloppe.pourcentage} %{" "}
            </div>
          }
        >
          {enveloppe.sousEnveloppes.map((sousEnveloppe) => (
            <ShowDetails
              className={styles["subEnvContainer"]}
              id={enveloppe.enveloppe + sousEnveloppe.sousEnveloppe}
              key={sousEnveloppe.sousEnveloppe}
              title={
                <h4>
                  {sousEnveloppe.sousEnveloppe}: {sousEnveloppe.total} == {sousEnveloppe.pourcentage} %{" "}
                </h4>
              }
            >
              {sousEnveloppe.modesDeDélégation.map((mode) => (
                <div className={styles["modesDeDelegation"]} key={mode.modeDeDélégation}>
                  <b>mode De Délégation : {mode.modeDeDélégation} </b>
                  <br />
                  <b>pourcentage : {mode.pourcentage} </b>
                  <br />
                </div>
              ))}
            </ShowDetails>
          ))}
        </ShowDetails>
      ))}

      {data.map((enveloppe) => (
        <div className={styles["envContainer"]} key={enveloppe.enveloppe}>
          <b>Enveloppe : {enveloppe.enveloppe} </b>
          <br />
          <b>total : {enveloppe.total} </b>
          <br />
          <b>pourcentage : {enveloppe.pourcentage} </b>
          <br />

          {enveloppe.sousEnveloppes.map((sousEnveloppe) => (
            <div className={styles["subEnvContainer"]} key={sousEnveloppe.sousEnveloppe}>
              <b>SousEnveloppe : {sousEnveloppe.sousEnveloppe} </b>
              <br />
              <b>total : {sousEnveloppe.total} </b>
              <br />
              <b>pourcentage : {sousEnveloppe.pourcentage} </b>
              <br />

              {sousEnveloppe.modesDeDélégation.map((mode) => (
                <div className={styles["modesDeDelegation"]} key={mode.modeDeDélégation}>
                  <b>mode De Délégation : {mode.modeDeDélégation} </b>
                  <br />
                  <b>pourcentage : {mode.pourcentage} </b>
                  <br />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
