import Head from "next/head";
import { ReactChild, useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { InfoBulle } from "../commun/InfoBulle/InfoBulle";
import { Table } from "../commun/Table/Table";
import { SelectionAnneeTags, SelectionTags } from "../commun/Tag";
import { TableFooterRechercheAvancee } from "../recherche-avancee/resultat-recherche-avancee/resultat-recherche-avancee-footer/RechercheAvanceeFooter";
import { SelectedRows } from "../recherche-avancee/resultat-recherche-avancee/ResultatRechercheAvancee";
import styles from "./Comparaison.module.css";
import { contenuModal, tableHeaders } from "./model/data";
import { useComparaison } from "./useComparaison";

interface ComparaisonPageProps {
  listeAnnees: number[]; // Define the expected prop type
}

export const ComparaisonPage = ({ listeAnnees }: ComparaisonPageProps) => {
  const [selectedRows, setSelectedRows] = useState<SelectedRows>([]);
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState(listeAnnees[listeAnnees.length - 1]);
  const [structureChoice, setStructurechoice] = useState<string>("Médico-social");
  const { lancerLaComparaison, resultats, moyenne, nombreRésultats, lastPage, loading } = useComparaison();

  const [estCeOuvert, setEstCeOuvert] = useState<boolean>(false);
  const [estCeOuvertMoyenne, setEstCeOuvertMoyenne] = useState<boolean>(false);
  const [titre, setTitre] = useState<ReactChild>("");
  const [contenu, setContenu] = useState();

  const [page, setPage] = useState<number>(1);

  // lancer la comparaison en changeant l'année ou la page
  useEffect(() => {
    lancerLaComparaison(page, annéeEnCours + '');
  }, [page, annéeEnCours]);

  const getAllTypes = () => {
    const result: string[] = [];
    resultats.forEach((element) => {
      if (!result.includes(element.type)) {
        result.push(element.type);
      }
    });
    return result;
  };

  // Ovrir la Pop-up d'info des icones de tableau
  const openModal = (header: string) => {
    setTitre(contenuModal(header).titre);
    setContenu(contenuModal(header).contenu);
    setEstCeOuvert(true);
  };

  const isAllSelected = resultats.length > 0 && selectedRows[page] && selectedRows[page].length === resultats.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows({ ...selectedRows, [page]: [] });
    } else {
      setSelectedRows({ ...selectedRows, [page]: resultats });
    }
  };

  const onClickDelete = (numeroFinessASupprimer: string) => {
    const listFiness = sessionStorage.getItem("listFinessNumbers");
    const listFinessArray: string[] = listFiness ? JSON.parse(listFiness) : [];
    const indexElementToDelete = listFinessArray.indexOf(numeroFinessASupprimer);
    if (indexElementToDelete > -1) {
      listFinessArray.splice(indexElementToDelete, 1);
      sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessArray));
      document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessArray))}; path=/`;
    }
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
                data={resultats}
                forMoyenne={moyenne}
                handleInfoBullMoyenne={setEstCeOuvertMoyenne}
                handleSelectAll={handleSelectAll}
                headers={tableHeaders}
                isAllSelected={isAllSelected}
                isShowAvrage={true}
                onClickDelete={onClickDelete}
                onClickInfobull={openModal}
                order=""
                orderBy=""
                page={page || 1}
                selectedRows={selectedRows}
                setOrder={() => { }}
                setOrderBy={() => { }}
                setSelectedRows={setSelectedRows}
                total={nombreRésultats}
              />
              <TableFooterRechercheAvancee lastPage={lastPage} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => { })} />
            </>
          )}
        </div>
        <InfoBulle estCeOuvert={estCeOuvert} identifiant="info-bull-comparaison-table" setEstCeOuvert={setEstCeOuvert} titre={titre}>
          <>{contenu}</>
        </InfoBulle>
        <InfoBulle
          estCeOuvert={estCeOuvertMoyenne}
          identifiant="info-bull-comparaison-table"
          setEstCeOuvert={setEstCeOuvertMoyenne}
          titre="Calcul de la moyenne"
        >
          <>Les données non renseignées sont exclues du calcul de la moyenne.</>
        </InfoBulle>
      </main>
    </>
  );
};
