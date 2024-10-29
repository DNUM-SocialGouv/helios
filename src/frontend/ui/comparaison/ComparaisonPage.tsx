import Head from "next/head";
import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { Table } from "../commun/Table/Table";
import { SelectionAnneeTags, SelectionTags } from "../commun/Tag";
import styles from "./Comparaison.module.css";
import { tableData } from "./model/data";
import { useComparaison } from "./useComparaison";

const tableHeaders = [
  { label: "", key: "delete" },
  { label: "", key: "etsLogo", sort: true },
  { label: "", key: "favori", sort: true },
  { label: "Raison Sociale Courte", key: "socialReason", sort: true },
  { label: "Numéro Finess", key: "numéroFiness", sort: true },
  { label: "Capacité Totale", key: "capacite_totale", sort: true },
  { label: "Réalisation de l'activité", key: "realisation_activite" },
  { label: "HP", key: "hp" },
  { label: "HT", key: "ht" },
  { label: "AJ", key: "aj" },
  { label: "Prestations externes vs directes", key: "prestations_externes_vs_direct" },
  { label: "Rotation du personnel", key: "rotation_personnel" },
  { label: "ETP vacants", key: "ETP_vacants" },
  { label: "Absentéiseme", key: "abesenteisme" },
  { label: "CAF", key: "CAF" },
  { label: "Vétusté", key: "vetuste" },
  { label: "Resultat net comptable", key: "resultat_net_comptable" },
];

export const ComparaisonPage = () => {
  const { construisLeLien } = useComparaison();
  const { wording } = useDependencies();
  // const { buildRechecheView } = useFavoris();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(2023);
  const [structureChoice, setStructurechoice] = useState<string>("Social et Médico-social");

  const dataTable = tableData.filter((element) => element.type === structureChoice && element.annee === annéeEnCours);

  const getAllTypes = () => {
    const result: string[] = [];
    tableData.forEach((element) => {
      if (!result.includes(element.type)) {
        result.push(element.type);
      }
    });
    return result;
  };

  const getAllYears = () => {
    const result: number[] = [];
    tableData.forEach((element) => {
      if (!result.includes(element.annee)) {
        result.push(element.annee);
      }
    });
    return result;
  };

  return (
    <main className="fr-container">
      <Head>
        <title>Page de comparaison</title>
      </Head>
      <div className={styles["container"]}>
        <h1>{wording.COMPARAISON}</h1>
        <button className="fr-btn fr-btn--secondary fr-mb-1w" type="button">
          {wording.AJOUTER_DES_ETABLISSEMENTS}
        </button>
        <div className={styles["years-container"]}>
          <div className={styles["years-container"]}>
            <span style={{ marginTop: "5px" }}>Année</span>
            <SelectionAnneeTags annees={getAllYears()} id="capacite-sanitaire" setAnnéeEnCours={setAnnéeEnCours} />
          </div>
          <div className={styles["years-container"]}>
            <span style={{ marginTop: "5px" }}>Indicateurs</span>
            <SelectionTags
              choices={["Sanitaire", "Social et Médico-social", "Entités Juridiques"]}
              noSelectableChoices={getAllTypes()}
              selectedChoice={structureChoice}
              setSelectedChoice={setStructurechoice}
            />
          </div>
        </div>
        {annéeEnCours}
        {/* TO DO: add selectedRows and setSelectedRows */}
        <Table
          data={dataTable}
          headers={tableHeaders}
          isShowAvrage={true}
          redirectingPath={construisLeLien(structureChoice)}
          selectedRows={[]}
          setSelectedRows={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </main>
  );
};
