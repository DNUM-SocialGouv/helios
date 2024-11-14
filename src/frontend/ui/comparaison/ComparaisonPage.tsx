import Head from "next/head";
import { ReactChild, useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { InfoBulle } from "../commun/InfoBulle/InfoBulle";
import { Table } from "../commun/Table/Table";
import { SelectionAnneeTags, SelectionTags } from "../commun/Tag";
import { ComparaisonViewModel, MoyenneResultatComparaison } from "../home/ComparaisonViewModel";
import styles from "./Comparaison.module.css";
import { contenuModal, tableHeaders } from "./model/data";
import { useComparaison } from "./useComparaison";

export const ComparaisonPage = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(2021);
  const [structureChoice, setStructurechoice] = useState<string>("Médico-social");
  const { lancerLaComparaison, resultats, moyenne } = useComparaison();

  const [dataTable, setDataTable] = useState<ComparaisonViewModel[]>([]);
  const [moyenneResultat, setMoyenneResultat] = useState<MoyenneResultatComparaison[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Nouvelle variable d'état pour le chargement
  const [listeAnnees, setListeAnnees] = useState<number[]>([]);
  const [estCeOuvert, setEstCeOuvert] = useState<boolean>(false);
  const [titre, setTitre] = useState<ReactChild>("");
  const [contenu, setContenu] = useState();

  // Utilisation de useEffect pour lancer la comparaison
  useEffect(() => {
    const type = sessionStorage.getItem("comparaisonType");
    setStructurechoice(type || "Médico-social");
    const fetchData = async () => {
      await lancerLaComparaison();
      setLoading(false); // Lorsque les résultats sont prêts, on arrête le chargement
    };
    fetchData();
  }, [loading]);

  // Utilisation de useEffect pour filtrer les résultats dès que les résultats changent
  useEffect(() => {
    if (!loading) {
      // On ne filtre les résultats que lorsque le chargement est terminé
    }
    const filtredList: ComparaisonViewModel[] = [];
    resultats.forEach((element) => {
      if (element.type === "Médico-social" && element.annee === annéeEnCours) {
        filtredList.push(element);
      }
    });
    if (moyenne.length > 0) {
      setMoyenneResultat(moyenne);
    }
    setDataTable(filtredList);
    getAllYears();
  }, [loading, resultats, annéeEnCours]); // Dépendance sur les résultats et les filtres

  const getAllTypes = () => {
    const result: string[] = [];
    resultats.forEach((element) => {
      if (!result.includes(element.type)) {
        result.push(element.type);
      }
    });
    return result;
  };

  const getAllYears = () => {
    const result: number[] = [];
    resultats.forEach((element) => {
      if (!result.includes(element.annee)) {
        result.push(element.annee);
      }
    });
    setListeAnnees(result);
  };

  const openModal = (header: string) => {
    setTitre(contenuModal(header).titre);
    setContenu(contenuModal(header).contenu);
    setEstCeOuvert(true);
  };

  return (
    <>
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
              {listeAnnees.length > 0 && <SelectionAnneeTags annees={listeAnnees} id="capacite-sanitaire" setAnnéeEnCours={setAnnéeEnCours} />}
            </div>
            <div className={styles["years-container"]}>
              <span style={{ marginTop: "5px" }}>Indicateurs</span>
              <SelectionTags
                choices={["Sanitaire", "Médico-social", "Entités Juridiques"]}
                noSelectableChoices={getAllTypes()}
                selectedChoice={structureChoice}
                setSelectedChoice={setStructurechoice}
              />
            </div>
          </div>
          {/* Affichage conditionnel pendant le chargement */}
          {loading ? (
            <div>Chargement des résultats...</div>
          ) : (
            <Table
              data={dataTable}
              forMoyenne={moyenneResultat}
              headers={tableHeaders}
              isShowAvrage={true}
              onClickInfobull={openModal}
              order=""
              orderBy=""
              selectedRows={selectedRows}
              setOrder={() => { }}
              setOrderBy={() => { }}
              setSelectedRows={setSelectedRows}
            />
          )}
        </div>
        <InfoBulle estCeOuvert={estCeOuvert} identifiant="id77" setEstCeOuvert={setEstCeOuvert} titre={titre}>
          <>{contenu}</>
        </InfoBulle>
      </main>
    </>
  );
};
