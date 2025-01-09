import { useSession } from "next-auth/react";
import Head from "next/head";
import { ReactChild, useEffect, useState } from "react";

import { DatesMisAjourSources } from "../../../backend/métier/entities/ResultatDeComparaison";
import { useDependencies } from "../commun/contexts/useDependencies";
import { InfoBulle } from "../commun/InfoBulle/InfoBulle";
import { StringFormater } from "../commun/StringFormater";
import { Table } from "../commun/Table/Table";
import { SelectionAnneeTags, SelectionTags } from "../commun/Tag";
import { TableFooterRechercheAvancee } from "../recherche-avancee/resultat-recherche-avancee/resultat-recherche-avancee-footer/RechercheAvanceeFooter";
import { SelectedRows } from "../recherche-avancee/resultat-recherche-avancee/ResultatRechercheAvancee";
import { AjoutEtablissements } from "./ajout-etablissements/AjoutEtablissements";
import styles from "./Comparaison.module.css";
import ExportExcel from "./ExportExcel";
import { useComparaison } from "./useComparaison";

interface ComparaisonPageProps {
  listeAnnees: number[];
  codeProfiles: string[];
  codeRegion: string;
  datesMisAjour: DatesMisAjourSources;
}

export const ComparaisonPage = ({ listeAnnees, datesMisAjour, codeProfiles, codeRegion }: ComparaisonPageProps) => {
  const { data } = useSession();

  const [selectedRows, setSelectedRows] = useState<SelectedRows>([]);
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState(listeAnnees[listeAnnees.length - 1]);
  const [structureChoice, setStructurechoice] = useState<string>("Médico-social");
  const { lancerLaComparaison, contenuModal, resultats, moyenne, nombreRésultats, lastPage, loading, NombreDeResultatsMaxParPage } = useComparaison();

  const [estCeOuvert, setEstCeOuvert] = useState<boolean>(false);
  const [estCeOuvertMoyenne, setEstCeOuvertMoyenne] = useState<boolean>(false);
  const [titre, setTitre] = useState<ReactChild>("");
  const [contenu, setContenu] = useState();

  const [page, setPage] = useState<number>(1);
  const [isShowAjoutEtab, setIsShowAjoutEtab] = useState<boolean>(false);

  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [deleteEt, setDeleteET] = useState(false);

  const [reloadTable, setReloadTable] = useState<boolean>(false);

  // lancer la comparaison en changeant l'année ou la page, en lanceant un tri ou une suppression
  useEffect(() => {
    lancerLaComparaison(page, annéeEnCours + "", order, orderBy, codeRegion, codeProfiles);
    setReloadTable(false);
  }, [page, annéeEnCours, order, orderBy, deleteEt, reloadTable]);

  const getAllTypes = () => {
    const result: string[] = [];
    resultats.forEach((element) => {
      if (!result.includes(element.type)) {
        result.push(element.type);
      }
    });
    return result;
  };

  const tableHeaders = [
    { label: "", key: "delete" },
    { label: "", key: "etsLogo", sort: true },
    { label: "", key: "favori" },
    { label: "Raison Sociale Courte", key: "socialReason", sort: true, orderBy: "raison_sociale_courte" },
    { label: "Numéro Finess", key: "numéroFiness", sort: true, orderBy: "numero_finess_etablissement_territorial" },
    {
      label: `Capacité Totale au ` + StringFormater.formatDate(datesMisAjour.date_mis_a_jour_finess),
      key: "capacite",
      info: true,
      sort: true,
      orderBy: "capacite_total",
    },
    { label: "Réalisation de l'activité", key: "realisationActivite", info: true, sort: true, orderBy: "taux_realisation_activite" },
    { label: "Activité personnes accompagnées", key: "fileActivePersonnesAccompagnes", info: true, sort: true, orderBy: "file_active_personnes_accompagnees" },
    { label: "TO HP", key: "hebergementPermanent", info: true, sort: true, orderBy: "taux_occupation_en_hebergement_permanent" },
    { label: "TO HT", key: "hebergementTemporaire", info: true, sort: true, orderBy: "taux_occupation_en_hebergement_temporaire" },
    { label: "TO AJ", key: "acceuilDeJour", info: true, sort: true, orderBy: "taux_occupation_accueil_de_jour" },
    { label: "Prestations externes vs directes", key: "prestationExterne", info: true, sort: true, orderBy: "taux_prestation_externes" },
    { label: "Rotation du personnel", key: "rotationPersonnel", info: true, sort: true, orderBy: "taux_rotation_personnel" },
    { label: "ETP vacants", key: "etpVacant", info: true, sort: true, orderBy: "taux_etp_vacants" },
    { label: "Absentéisme", key: "absenteisme", info: true, sort: true, orderBy: "taux_absenteisme_hors_formation" },
    { label: "CAF", key: "tauxCaf", info: true, sort: true, orderBy: "taux_de_caf" },
    { label: "Vétusté", key: "vetusteConstruction", info: true, sort: true, orderBy: "taux_de_vetuste_construction" },
    { label: "FRNG", key: "roulementNetGlobal", info: true, sort: true, orderBy: "fonds_de_roulement" },
    { label: "Résultat net comptable", key: "resultatNetComptable", info: true, sort: true, orderBy: "resultat_net_comptable" },
  ];

  // Ovrir la Pop-up d'info des icones de tableau
  const openModal = (header: string) => {
    setTitre(contenuModal(header, datesMisAjour).titre);
    setContenu(contenuModal(header, datesMisAjour).contenu);
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
      if (lastPage > Math.ceil(listFinessArray.length / NombreDeResultatsMaxParPage) && page !== 1) {
        setPage(page - 1);
      }
    }
    setDeleteET(!deleteEt);
  };

  return (
    <>
      <main className="fr-container">
        <Head>
          <title>Page de comparaison</title>
        </Head>
        <div className={styles["container"]}>
          <div className={styles["header-container"]}>
            <h1>{wording.COMPARAISON}</h1>
            <ExportExcel
              codeProfiles={codeProfiles}
              codeRegion={codeRegion}
              datesMisAjour={StringFormater.formatDate(datesMisAjour.date_mis_a_jour_finess)}
              disabled={resultats.length === 0}
              order={order}
              orderBy={orderBy}
              year={String(annéeEnCours)}
            />
          </div>
          <div className={styles["ajout-etab-div"]}>
            {!isShowAjoutEtab && (
              <button className={`${styles["button-add-etab"]} fr-btn fr-btn--secondary`} onClick={() => setIsShowAjoutEtab(true)}>
                {wording.AJOUTER_DES_ETABLISSEMENTS}
              </button>
            )}
            {isShowAjoutEtab && <AjoutEtablissements setIsShowAjoutEtab={setIsShowAjoutEtab} setReloadTable={setReloadTable}></AjoutEtablissements>}
          </div>
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
                isCenter={true}
                isShowAvrage={true}
                onClickDelete={onClickDelete}
                onClickInfobull={openModal}
                order={order}
                orderBy={orderBy}
                page={page || 1}
                selectedRows={selectedRows}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                setSelectedRows={setSelectedRows}
                total={nombreRésultats}
              />
              <TableFooterRechercheAvancee lastPage={lastPage} nombreDeResultatsMaxParPage={NombreDeResultatsMaxParPage} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage || (() => { })} />
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
          <>{data?.user.role === 3 || data?.user.role === 2 ? wording.INFOBULLE_MOYENNE_UTILISATEURS : wording.INFOBULLE_MOYENNE_ADMIN_NATIONAL}</>
        </InfoBulle>
      </main>
    </>
  );
};
