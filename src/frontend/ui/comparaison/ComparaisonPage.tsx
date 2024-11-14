import Head from "next/head";
import { ReactChild, useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { InfoBulle } from "../commun/InfoBulle/InfoBulle";
import { Table } from "../commun/Table/Table";
import { SelectionAnneeTags, SelectionTags } from "../commun/Tag";
import { ComparaisonViewModel, initialData, MoyenneResultatComparaison } from "../home/ComparaisonViewModel";
import { TableFooterRechercheAvancee } from "../recherche-avancee/resultat-recherche-avancee/resultat-recherche-avancee-footer/RechercheAvanceeFooter";
import styles from "./Comparaison.module.css";
import { contenuModal, tableHeaders } from "./model/data";
import { useComparaison } from "./useComparaison";

export const ComparaisonPage = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(0);
  const [structureChoice, setStructurechoice] = useState<string>("Médico-social");
  const { construisLeLien, lancerLaComparaison, resultats, moyenne, lastPage } = useComparaison();

  const [dataTable, setDataTable] = useState<ComparaisonViewModel[]>([]);
  const [moyenneResultat, setMoyenneResultat] = useState<MoyenneResultatComparaison>(initialData);
  const [loading, setLoading] = useState<boolean>(true); // Nouvelle variable d'état pour le chargement
  const [listeAnnees, setListeAnnees] = useState<number[]>([]);
  const [estCeOuvert, setEstCeOuvert] = useState<boolean>(false);
  const [titre, setTitre] = useState<ReactChild>("");
  const [contenu, setContenu] = useState();

  const [page, setPage] = useState<number | undefined>(1);
  const [nombreRésultats, setNombreRésultats] = useState<number>(1);

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
      if (resultats.length > 0) {
        const filtredList: ComparaisonViewModel[] = [];
        resultats.forEach((element) => {
          if (element.type === structureChoice && element.annee === annéeEnCours) {
            filtredList.push(element);
          }
        });
        if (moyenne.length > 0) {
          recupererMoyenneParAnnee(filtredList.length, annéeEnCours);
        }
        setDataTable(filtredList);
        getAllYears();
      }
    }
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
    let nearestYear = resultats && resultats.length > 0 ? resultats[0].annee : 2022;
    resultats.forEach((element) => {
      if (!result.includes(element.annee)) {
        result.push(element.annee);
      }
      nearestYear = element.annee > nearestYear ? element.annee : nearestYear;
    });
    setListeAnnees(result);
    if (annéeEnCours === 0) {
      setAnnéeEnCours(nearestYear);
    }
  };

  const recupererMoyenneParAnnee = (nombreRésultats: number, annee: number) => {
    moyenne.forEach((element) => {
      if (element.annee === annee) {
        element.nombreEtablissement = nombreRésultats;
        setMoyenneResultat(element);
        setNombreRésultats(nombreRésultats);
      }
    });
  };

  // Ovrir la Pop-up d'info des icones de tableau
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
            <>
              <Table
                data={dataTable}
                forMoyenne={moyenneResultat}
                headers={tableHeaders}
                isShowAvrage={true}
                onClickInfobull={openModal}
                order=""
                orderBy=""
                redirectingPath={construisLeLien(structureChoice)}
                selectedRows={selectedRows}
                setOrder={() => {}}
                setOrderBy={() => {}}
                setSelectedRows={setSelectedRows}
              />
              <TableFooterRechercheAvancee lastPage={lastPage} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => {})} />
            </>
          )}
        </div>
        <InfoBulle estCeOuvert={estCeOuvert} identifiant="info-bull-comparaison-table" setEstCeOuvert={setEstCeOuvert} titre={titre}>
          <>{contenu}</>
        </InfoBulle>
      </main>
    </>
  );
};
