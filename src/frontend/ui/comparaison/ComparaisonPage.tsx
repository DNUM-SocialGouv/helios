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
import { ComparaisonEJViewModel, ComparaisonSANViewModel, ComparaisonSMSViewModel } from "../home/ComparaisonViewModel";
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
  const { lancerLaComparaison, contenuModal, tableHeaders, getListAnnees, getcomparedTypes, resultats, nombreRésultats, lastPage, loading, NombreDeResultatsMaxParPage, listeAnnees } = useComparaison();

  const [estCeOuvert, setEstCeOuvert] = useState<boolean>(false);
  const [titre, setTitre] = useState<ReactNode>("");
  const [contenu, setContenu] = useState();

  const [isShowAjoutEtab, setIsShowAjoutEtab] = useState<boolean>(false);

  const [favorisListName, setFavorisListName] = useState<string>("");
  const [showAddToListSuccess, setShowAddToListSuccess] = useState<boolean>(false);

  const [comparedTypes, setComparedTypes] = useState<string[]>([]);

  const [params, setParams] = useState<{
    annéeEnCours: number;
    order: string;
    orderBy: string;
    page: number;
    comparedFiness: string[];
  }>({
    annéeEnCours: listeAnnees ? listeAnnees[listeAnnees.length - 1] : 0,
    order: "",
    orderBy: "",
    page: 1,
    comparedFiness: [],
  });

  const [triggerCompare, setTriggerCompare] = useState<number>(0);

  useEffect(() => {
    if (structureChoice !== "") {
      const resetParams = async () => {
        const finessStored = sessionStorage.getItem("listFinessNumbers");
        const finessList = finessStored ? JSON.parse(finessStored) : [];

        const annees = await getListAnnees(structureChoice, finessList);
        const latestYear = annees[annees.length - 1];

        setParams({
          comparedFiness: finessList,
          annéeEnCours: latestYear,
          order: "",
          orderBy: "",
          page: 1,
        });
        setTriggerCompare(Date.now());
      };
      resetParams();
    }
  }, [structureChoice, comparedTypes]);

  useEffect(() => {
    if (
      structureChoice !== "" &&
      params.annéeEnCours &&
      params.comparedFiness.length > 0
    ) {
      lancerLaComparaison(
        params.comparedFiness,
        structureChoice,
        params.annéeEnCours.toString(),
        codeRegion,
        codeProfiles,
        params.order,
        params.orderBy,
        params.page
      );
    }
  }, [triggerCompare]);

  const handleOrderChange = (order: string) => {
    setParams(prev => ({
      ...prev,
      order,
    }));
    setTriggerCompare(Date.now());
  };

  const handleOrderByChange = (orderBy: string) => {
    setParams(prev => ({
      ...prev,
      orderBy,
    }));
    setTriggerCompare(Date.now());
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({
      ...prev,
      page: newPage,
    }));
    setTriggerCompare(Date.now());
  };

  const handleYearChange = (newYear: number) => {
    setParams(prev => ({
      ...prev,
      annéeEnCours: newYear,
    }));
    setTriggerCompare(Date.now());
  };

  const handleFinessChange = (numerosFiness: string[]) => {
    setParams(prev => ({
      ...prev,
      comparedFiness: numerosFiness,
    }));
  };

  useEffect(() => {
    async function getSelectedTypesForCompare() {
      const listFinessNumbers = sessionStorage.getItem("listFinessNumbers");
      const typesSelected = await getcomparedTypes(listFinessNumbers ? JSON.parse(listFinessNumbers) : [])
      setComparedTypes(typesSelected)
    }
    getSelectedTypesForCompare();
  }, [])

  useEffect(() => {
    if (comparedTypes.length !== 0) {
      if (comparedTypes.includes("Médico-social"))
        setStructureChoice("Médico-social");
      else if (comparedTypes.includes("Sanitaire"))
        setStructureChoice("Sanitaire");
      else setStructureChoice("Entité juridique");
    }
  }, [comparedTypes])

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

  const onClickDelete = async (etablissementASupprimer: RechercheViewModel | ComparaisonSMSViewModel | ComparaisonEJViewModel | ComparaisonSANViewModel) => {
    const listFiness = sessionStorage.getItem("listFinessNumbers");
    const listFinessArray: string[] = listFiness ? JSON.parse(listFiness) : [];
    const indexElementToDelete = listFinessArray.indexOf(etablissementASupprimer.numéroFiness);
    if (indexElementToDelete > -1) {
      listFinessArray.splice(indexElementToDelete, 1);
      sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessArray));
      if (lastPage > Math.ceil(listFinessArray.length / NombreDeResultatsMaxParPage) && params.page !== 1) {
        setParams(prev => ({
          ...prev,
          page: prev.page - 1
        }));
      }
      setParams(prev => ({
        ...prev,
        comparedFiness: listFinessArray,
      }));
    }
    const typesSelected = await getcomparedTypes(listFinessArray)
    setComparedTypes(typesSelected);
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
            order={params.order}
            orderBy={params.orderBy}
            selectedRows={selectedRows}
            setOrder={handleOrderChange}
            setOrderBy={handleOrderByChange}
            setSelectedRows={setSelectedRows}
            total={nombreRésultats}
          />
          <TableFooter lastPage={lastPage} nombreDeResultatsMaxParPage={NombreDeResultatsMaxParPage} nombreRésultats={nombreRésultats} page={params.page || 1} setPage={handlePageChange || (() => { })} />
        </>
      )
    }
    return content;
  }

  const exportExcel = () => {
    let anneeExport = params.annéeEnCours;
    if (!anneeExport && listeAnnees) {
      anneeExport = listeAnnees[listeAnnees.length - 1];
    }
    return <ExportExcel
      codeProfiles={codeProfiles}
      codeRegion={codeRegion}
      datesMisAjour={StringFormater.formatDate(datesMisAjour.date_mis_a_jour_finess)}
      disabled={resultats.length === 0}
      order={params.order}
      orderBy={params.orderBy}
      type={structureChoice}
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
          {isShowAjoutEtab && <AjoutEtablissements categories={categories} getcomparedTypes={getcomparedTypes} handleFinessChange={handleFinessChange} setComparedTypes={setComparedTypes} setIsShowAjoutEtab={setIsShowAjoutEtab} ></AjoutEtablissements>}
        </div>
        {showAddToListSuccess && <SuccessAlert message={wording.LIST_ACTION_FAVORIS_SUCCESS_MESSAGE(favorisListName)} />}
        <div className={styles["years-container"]}>
          <div className={styles["years-container"]}>
            <span style={{ marginTop: "5px" }}>Année</span>
            {(listeAnnees && listeAnnees.length > 0) && <SelectionAnneeTags anneeEnCours={params.annéeEnCours} annees={listeAnnees} id="capacite-sanitaire" setAnnéeEnCours={handleYearChange} />}
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
