import Head from "next/head";
import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { Table } from "../commun/Table/Table";
import { SelectionAnneeTags, SelectionTags } from "../commun/Tag";
import { useFavoris } from "../favoris/useFavoris";
import styles from "./Comparaison.module.css"

const tableHeaders = [
    { label: "", key: "delete" },
    { label: "", key: "etsLogo", sort: true },
    { label: "", key: "favori", sort: true },
    { label: "Commune", key: "commune", sort: true },
    { label: "Département", key: "département", sort: true },
    { label: "Numéro Finess", key: "numéroFiness" },
    { label: "Raison Sociale Courte", key: "raisonSocialeCourte" },
    { label: "Type", key: "type" }
];

const tableData = [
    {
        "commune": "OYONNAX",
        "département": "AIN",
        "numéroFiness": "010008407",
        "raisonSocialeCourte": "CH DU HAUT BUGEY",
        "type": "Entité juridique"
    },
    {
        "commune": "OYONNAX",
        "département": "AIN",
        "numéroFiness": "010003598",
        "raisonSocialeCourte": "IFAS CH DU HAUT BUGEY",
        "type": "Médico-social"
    },
    {
        "commune": "OYONNAX",
        "département": "AIN",
        "numéroFiness": "010005239",
        "raisonSocialeCourte": "CH DU HAUT BUGEY - GEOVREISSET",
        "type": "Sanitaire"
    },
    {
        "commune": "NANTUA",
        "département": "AIN",
        "numéroFiness": "010007961",
        "raisonSocialeCourte": "SSIAD CH HAUT-BUGEY SITE DE NANTUA",
        "type": "Médico-social"
    },
    {
        "commune": "NANTUA",
        "département": "AIN",
        "numéroFiness": "010786036",
        "raisonSocialeCourte": "EHPAD NANTUA \"LES JARDINS DU LAC\"",
        "type": "Médico-social"
    },
    {
        "commune": "OYONNAX",
        "département": "AIN",
        "numéroFiness": "010786077",
        "raisonSocialeCourte": "EHPAD LE TOURNANT DES SAISONS",
        "type": "Médico-social"
    }
]

export const ComparaisonPage = () => {
    const { wording } = useDependencies();
    const { buildRechecheView } = useFavoris();
    const [annéeEnCours, setAnnéeEnCours] = useState<number>(2022);
    

    const dataTable = tableData.map((element) => buildRechecheView(element))
    // console.log(dataTable);

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
                        <span>Année</span>
                        <SelectionAnneeTags annees={[2022, 2023]} id="capacite-sanitaire" setAnnéeEnCours={setAnnéeEnCours} />
                    </div>
                    <div className={styles["years-container"]}>
                        <span>Indicateurs</span>
                        <SelectionTags choices={["Sanitaire", "Social et Médico-social", "Entités Juridiques"]} />
                    </div>
                </div>
                {/* TO DO: add selectedRows and setSelectedRows */}
                <Table data={dataTable} headers={tableHeaders} />
            </div>
        </main>
    );
};