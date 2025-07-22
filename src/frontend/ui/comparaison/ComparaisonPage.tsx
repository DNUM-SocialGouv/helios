import Head from "next/head";
import { ReactNode, useContext, useEffect, useState } from "react";

import { AjoutEtablissements } from "./ajout-etablissements/AjoutEtablissements";
import styles from "./Comparaison.module.css";
import ExportExcel from "./ExportExcel";
import { useComparaison } from "./useComparaison";
import { DatesMisAjourSources } from "../../../backend/métier/entities/ResultatDeComparaison";
import { ComparaisonContext } from "../commun/contexts/ComparaisonContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { InfoBulle } from "../commun/InfoBulle/InfoBulle";
import { StringFormater } from "../commun/StringFormater";
import { SuccessAlert } from "../commun/SuccessAlert/SuccessAlert";
import { Table } from "../commun/Table/Table";
import { SelectionAnneeTags, SelectionTags } from "../commun/Tag";
import { ComparaisonEJViewModel, ComparaisonSMSViewModel } from "../home/ComparaisonViewModel";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { ListActionsButton } from "../liste/ListActionsButton";
import { CategoriesFinessViewModel } from "../recherche-avancee/model/CategoriesFinessViewModel";
import { TableFooter } from "../recherche-avancee/resultat-recherche-avancee/resultat-recherche-avancee-footer/TableFooter";

interface ComparaisonPageProps {
  codeProfiles: string[];
  codeRegion: string;
  datesMisAjour: DatesMisAjourSources;
  categories: CategoriesFinessViewModel[];
}

export const ComparaisonPage = ({ datesMisAjour, codeProfiles, codeRegion, categories }: ComparaisonPageProps) => {
  const comparaisonContext = useContext(ComparaisonContext);

  const [selectedRows, setSelectedRows] = useState<Map<string, string>>(new Map());
  const { wording } = useDependencies();
  const [structureChoice, setStructureChoice] = useState<string>("");
  const { lancerLaComparaison, contenuModal, tableHeaders, getListAnnees, resultats, nombreRésultats, lastPage, loading, NombreDeResultatsMaxParPage, listeAnnees } = useComparaison();
  const [annéeEnCours, setAnnéeEnCours] = useState(listeAnnees ? listeAnnees[listeAnnees.length - 1] : 0);

  const [estCeOuvert, setEstCeOuvert] = useState<boolean>(false);
  const [titre, setTitre] = useState<ReactNode>("");
  const [contenu, setContenu] = useState();

  const [page, setPage] = useState<number>(1);
  const [isShowAjoutEtab, setIsShowAjoutEtab] = useState<boolean>(false);

  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [deleteEt, setDeleteEt] = useState(false);

  const [reloadTable, setReloadTable] = useState<boolean>(false);

  const [favorisListName, setFavorisListName] = useState<string>("");
  const [showAddToListSuccess, setShowAddToListSuccess] = useState<boolean>(false);

  const [comparedTypes, setComparedTypes] = useState<string[]>([]);
  const [comparedFiness, setComparedFiness] = useState<string[]>([]);


  // lancer la comparaison en changeant l'année ou la page, en lanceant un tri ou une suppression
  useEffect(() => {
    if (structureChoice !== "") {
      lancerLaComparaison(comparedFiness, structureChoice, annéeEnCours + "", codeRegion, codeProfiles, order, orderBy, page);
      setReloadTable(false);
    }
  }, [page, annéeEnCours, order, orderBy, deleteEt, reloadTable, structureChoice]);

  useEffect(() => {
    const typeStored = sessionStorage.getItem("comparaisonType");
    setComparedTypes(typeStored ? JSON.parse(typeStored) : [])
  }, [reloadTable, deleteEt])

  useEffect(() => {
    if (comparedTypes.length !== 0) {
      if (comparedTypes.includes("Médico-social"))
        setStructureChoice("Médico-social");
      else if (comparedTypes.includes("Sanitaire"))
        setStructureChoice("Sanitaire");
      else setStructureChoice("Entité juridique");
    }
  }, [comparedTypes])

  useEffect(() => {
    if (structureChoice !== "") {
      const fetchData = async () => {
        const finessStored = sessionStorage.getItem("listFinessNumbers");
        setComparedFiness(finessStored ? JSON.parse(finessStored) : []);

        const annees = await getListAnnees(structureChoice, finessStored ? JSON.parse(finessStored) : []);
        setAnnéeEnCours(annees[annees.length - 1]);
      };
      fetchData();
    }
  }, [structureChoice])

  // Ovrir la Pop-up d'info des icones de tableau
  const openModal = (header: string) => {
    setTitre(contenuModal(header, datesMisAjour).titre);
    setContenu(contenuModal(header, datesMisAjour).contenu);
    setEstCeOuvert(true);
  };

  let isAllSelected = true;
  for (const etablissement of resultats) {
    if (!selectedRows.has(etablissement.numéroFiness)) {
      isAllSelected = false;
      break;
    }
  };


  const handleSelectAll = () => {
    const newSelected = new Map(selectedRows);
    if (isAllSelected) {
      resultats.forEach((etablissement) => newSelected.delete(etablissement.numéroFiness));
    } else {
      resultats.forEach((etablissement) => newSelected.set(etablissement.numéroFiness, etablissement.type));
    }
    setSelectedRows(newSelected);
  };

  const onClickDelete = (etablissementASupprimer: RechercheViewModel | ComparaisonSMSViewModel | ComparaisonEJViewModel) => {
    const listFiness = sessionStorage.getItem("listFinessNumbers");
    const typeStored = sessionStorage.getItem("comparaisonType");
    const listFinessArray: string[] = listFiness ? JSON.parse(listFiness) : [];
    const indexElementToDelete = listFinessArray.indexOf(etablissementASupprimer.numéroFiness);
    if (indexElementToDelete > -1) {
      listFinessArray.splice(indexElementToDelete, 1);
      sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessArray));
      if (lastPage > Math.ceil(listFinessArray.length / NombreDeResultatsMaxParPage) && page !== 1) {
        setPage(page - 1);
      }
    }
    if (resultats.filter((value) => value.type === etablissementASupprimer.type).length === 1) {
      // supprimer la structure associée
      const typeStoredArray: string[] = typeStored ? JSON.parse(typeStored) : [];
      const indexStructureToDelete = typeStoredArray.indexOf(etablissementASupprimer.type);
      typeStoredArray.splice(indexStructureToDelete, 1);
      sessionStorage.setItem("comparaisonType", JSON.stringify(typeStoredArray));
    }
    setDeleteEt(!deleteEt);
  };

  const onClickAjoutEtablissement = () => {
    comparaisonContext?.setTerme("");
    setIsShowAjoutEtab(true);
  };

  const results = (): ReactNode => {
    let content;
    if (loading) {
      content = (<div>Chargement des résultats...</div>);
    } else if (nombreRésultats === 0) {
      content = (<div className={styles['informationText']}>{wording.COMPARAISON_AUCUN_FINESS}</div>)
    } else {
      content = (
        <>
          <Table
            data={resultats}
            handleSelectAll={handleSelectAll}
            headers={tableHeaders(datesMisAjour, structureChoice)}
            isAllSelected={isAllSelected}
            isCenter={true}
            isShowAvrage={false}
            isVScroll={true}
            onClickDelete={onClickDelete}
            onClickInfobull={openModal}
            order={order}
            orderBy={orderBy}
            selectedRows={selectedRows}
            setOrder={setOrder}
            setOrderBy={setOrderBy}
            setSelectedRows={setSelectedRows}
            total={nombreRésultats}
          />
          <TableFooter lastPage={lastPage} nombreDeResultatsMaxParPage={NombreDeResultatsMaxParPage} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => { })} />
        </>
      )
    }
    return content;
  }

  const exportExcel = () => {
    let anneeExport = annéeEnCours;
    if (!anneeExport && listeAnnees) {
      anneeExport = listeAnnees[listeAnnees.length - 1];
    }
    return <ExportExcel
      codeProfiles={codeProfiles}
      codeRegion={codeRegion}
      datesMisAjour={StringFormater.formatDate(datesMisAjour.date_mis_a_jour_finess)}
      disabled={resultats.length === 0}
      order={order}
      orderBy={orderBy}
      year={String(anneeExport)}
    />;
  }

  const handleAddToFavorisSuccess = (listName: string): void => {
    if (listName?.trim().length > 0) {
      setFavorisListName(listName);
      setShowAddToListSuccess(true);
    } else {
      setFavorisListName("");
      setShowAddToListSuccess(false);
    }
  }

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>Page de comparaison</title>
      </Head>
      <div className={styles["container"]}>
        <div className={styles["header-container"]}>
          <h1>{wording.COMPARAISON}</h1>
          <ListActionsButton exportButton={exportExcel()} onAddToFavorisSuccess={(listName: string) => handleAddToFavorisSuccess(listName)} selectedRows={selectedRows} />
        </div>
        <div className={styles["ajout-etab-div"]}>
          {!isShowAjoutEtab && (
            <button className={`${styles["button-add-etab"]} fr-btn fr-btn--secondary`} onClick={onClickAjoutEtablissement}>
              {wording.AJOUTER_DES_ETABLISSEMENTS}
            </button>
          )}
          {isShowAjoutEtab && <AjoutEtablissements categories={categories} setIsShowAjoutEtab={setIsShowAjoutEtab} setReloadTable={setReloadTable} />}
        </div>
        {showAddToListSuccess && <SuccessAlert message={wording.LIST_ACTION_FAVORIS_SUCCESS_MESSAGE(favorisListName)} />}
        <div className={styles["years-container"]}>
          <div className={styles["years-container"]}>
            <span style={{ marginTop: "5px" }}>Année</span>
            {(listeAnnees && listeAnnees.length > 0) && <SelectionAnneeTags annees={listeAnnees} id="capacite-sanitaire" setAnnéeEnCours={setAnnéeEnCours} />}
          </div>
          <div className={styles["years-container"]}>
            <span style={{ marginTop: "5px" }}>Indicateurs</span>
            <SelectionTags
              choices={["Sanitaire", "Médico-social", "Entité juridique"]}
              noSelectableChoices={comparedTypes}
              selectedChoice={structureChoice}
              setSelectedChoice={setStructureChoice}
            />
          </div>
        </div>
        {/* Affichage conditionnel pendant le chargement */}
        {results()}
      </div>
      <InfoBulle estCeOuvert={estCeOuvert} identifiant="info-bull-comparaison-table" setEstCeOuvert={setEstCeOuvert} titre={titre}>
        <>{contenu}</>
      </InfoBulle>
    </main>
  );
};
