import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useSession } from "next-auth/react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./ParametrageProfil.module.css";
import { useParametrageProfil } from "./useParametrageProfil";
import { useEffect, useState } from "react";

const expProfile = {
    
}

const profile = {
    "autreRegion": {
        "profilEJ": "ok",
        // {
        //     "identité": {
        //         "nom": "ok",
        //         "siret": "ok",
        //         "adresse": "ok",
        //         "habilité": "ok",
        //         "statut_EJ": "ok",
        //         "télEtEmail": "ok",
        //         "numéroFiness": "ok"
        //     },
        //     "activités": {

        //         "habilité": "ok",

        //         "nombrePassage": "ok",

        //         "nombreSéjours": "no",

        //         "nombreJournées": "no",

        //         "nombreSéjoursHad": "ok"

        //     },
        //     "budgetEtFinance": {

        //         "habilité": "ok",

        //         "tauxDeCafNette": "no",

        //         "compteRésultats": "ok",

        //         "résultatNetComptable": "no",

        //         "ratioDépendanceFinancière": "no"

        //     },
        //     "autorisationsEtCapacités": {

        //         "habilité": "ok",

        //         "capacités": "ok",

        //         "autresActivités": "ok",

        //         "autorisationsActivités": "no",

        //         "equipementMaterielLourdsActivités": "no",

        //         "reconnaissanceContractuelleActivités": "ok"

        //     }
        // },
        "profilETSanitaire": "ok", 
        // {
        //     "Qualité": {
        //         "missions": "ok",
        //         "vignette": "ok",
        //         "habilité": "ok",

        //         "nombre_reclamation": "ok",

        //         "nombre_incident_encours": "ok",

        //         "nombre_EIAS/EIGS_encours": "ok",

        //         "nombre_incident_cloturé": "ok",

        //         "nombre_reclamation_motif": "ok",

        //         "nombre_EIAS/EIGS_cloturé": "ok"

        //     },

        //     "identité": {

        //         "nom": "ok",

        //         "siret": "ok",

        //         "adresse": "ok",

        //         "habilité": "ok",

        //         "statut_EJ": "ok",

        //         "télEtEmail": "ok",

        //         "numéroFiness": "ok",

        //         "EJ_rattachement": "ok",

        //         "modeTarification": "ok",

        //         "catégorieÉtablissement": "ok"

        //     },

        //     "activités": {

        //         "habilité": "ok",

        //         "nombrePassage": "ok",

        //         "nombreSéjours": "ok",

        //         "nombreJournées": "ok"

        //     },

        //     "autorisationsEtCapacités": {

        //         "habilité": "ok",

        //         "capacités": "ok",

        //         "autresActivités": "no",

        //         "autorisationsActivités": "no",

        //         "equipementMaterielLourdsActivités": "no",

        //         "reconnaissanceContractuelleActivités": "no"

        //     }

        // },
        "profilMédicoSocial": "ok"
        // {

        //     "Qualité": {

        //         "missions": "ok",

        //         "vignette": "ok",

        //         "habilité": "ok",

        //         "nombre_EIAS/EIGS": "ok",

        //         "nombre_reclamation": "ok",

        //         "nombre_incident_encours": "ok",

        //         "nombre_incident_cloturé": "ok",

        //         "nombre_reclamation_motif": "ok"

        //     },

        //     "identité": {

        //         "nom": "ok",

        //         "siret": "ok",

        //         "adresse": "ok",

        //         "habilité": "ok",

        //         "statut_EJ": "ok",

        //         "télEtEmail": "ok",

        //         "numéroFiness": "ok",

        //         "EJ_rattachement": "ok",

        //         "modeTarification": "ok",

        //         "mono_établissement": "ok",

        //         "ET_principal_secondaire": "ok",

        //         "catégorieÉtablissement": "ok",

        //         "dateDEntréeEnVigueurDuCpom": "ok"

        //     },

        //     "activités": {

        //         "habilité": "ok",

        //         "tauxRéalisationActivité": "ok",

        //         "tauxOccupationAccueilDeJour": "ok",

        //         "fileActivePersonnesAccompagnées": "no",

        //         "tauxOccupationHébergementPermanent": "ok",

        //         "tauxOccupationHébergementTemporaire": "ok",

        //         "nombreMoyenJournéesAbsencePersonnesAccompagnées": "no",

        //         "duréeMoyenneSéjourAccompagnementPersonnesSorties": "no"

        //     },

        //     "budgetEtFinances": {

        //         "habilité": "ok",

        //         "tauxDeCafNette": "ok",

        //         "compteRésultats": "ok",

        //         "fondsDeRoulement": "ok",

        //         "résultatNetComptable": "ok",

        //         "tauxDeVétustéConstruction": "ok",

        //         "contributionAuxFraisDeSiège": "ok"

        //     },

        //     "ressourcesHumaines": {

        //         "habilité": "ok",

        //         "tauxDEtpVacants": "no",

        //         "tauxDAbsentéisme": "ok",

        //         "nombreDEtpRéalisés": "ok",

        //         "nombreDeCddDeRemplacement": "ok",

        //         "tauxDePrestationsExternes": "no",

        //         "tauxDeRotationDuPersonnel": "no"

        //     },

        //     "autorisationsEtCapacités": {

        //         "habilité": "ok",

        //         "capacités": "ok",

        //         "autorisations": "no"

        //     }

        // }

    },
    // "institution": {
    //     "profilEJ": {
    //         "identité": {

    //             "nom": "ok",

    //             "siret": "ok",

    //             "adresse": "ok",

    //             "habilité": "ok",

    //             "statut_EJ": "ok",

    //             "télEtEmail": "ok",

    //             "numéroFiness": "ok"

    //         },
    //         "activités": {

    //             "habilité": "ok",

    //             "nombrePassage": "ok",

    //             "nombreSéjours": "no",

    //             "nombreJournées": "no",

    //             "nombreSéjoursHad": "ok"

    //         },
    //         "budgetEtFinance": {

    //             "habilité": "ok",

    //             "tauxDeCafNette": "no",

    //             "compteRésultats": "ok",

    //             "résultatNetComptable": "no",

    //             "ratioDépendanceFinancière": "no"

    //         },
    //         "autorisationsEtCapacités": {

    //             "habilité": "ok",

    //             "capacités": "no",

    //             "autresActivités": "ok",

    //             "autorisationsActivités": "no",

    //             "equipementMaterielLourdsActivités": "no",

    //             "reconnaissanceContractuelleActivités": "ok"

    //         }
    //     },
    //     "profilETSanitaire": {

    //         "Qualité": {

    //             "missions": "ok",

    //             "vignette": "ok",

    //             "habilité": "ok",

    //             "nombre_reclamation": "ok",

    //             "nombre_incident_encours": "ok",

    //             "nombre_EIAS/EIGS_encours": "ok",

    //             "nombre_incident_cloturé": "ok",

    //             "nombre_reclamation_motif": "ok",

    //             "nombre_EIAS/EIGS_cloturé": "ok"

    //         },

    //         "identité": {

    //             "nom": "ok",

    //             "siret": "ok",

    //             "adresse": "ok",

    //             "habilité": "ok",

    //             "statut_EJ": "ok",

    //             "télEtEmail": "ok",

    //             "numéroFiness": "ok",

    //             "EJ_rattachement": "ok",

    //             "modeTarification": "ok",

    //             "catégorieÉtablissement": "ok"

    //         },

    //         "activités": {

    //             "habilité": "ok",

    //             "nombrePassage": "ok",

    //             "nombreSéjours": "ok",

    //             "nombreJournées": "ok"

    //         },

    //         "autorisationsEtCapacités": {

    //             "habilité": "ok",

    //             "capacités": "no",

    //             "autresActivités": "no",

    //             "autorisationsActivités": "no",

    //             "equipementMaterielLourdsActivités": "no",

    //             "reconnaissanceContractuelleActivités": "no"

    //         }

    //     },
    //     "profilMédicoSocial": {

    //         "Qualité": {

    //             "missions": "ok",

    //             "vignette": "ok",

    //             "habilité": "ok",

    //             "nombre_EIAS/EIGS": "ok",

    //             "nombre_reclamation": "ok",

    //             "nombre_incident_encours": "ok",

    //             "nombre_incident_cloturé": "ok",

    //             "nombre_reclamation_motif": "ok"

    //         },

    //         "identité": {

    //             "nom": "ok",

    //             "siret": "ok",

    //             "adresse": "ok",

    //             "habilité": "ok",

    //             "statut_EJ": "ok",

    //             "télEtEmail": "ok",

    //             "numéroFiness": "ok",

    //             "EJ_rattachement": "ok",

    //             "modeTarification": "ok",

    //             "mono_établissement": "ok",

    //             "ET_principal_secondaire": "ok",

    //             "catégorieÉtablissement": "ok",

    //             "dateDEntréeEnVigueurDuCpom": "ok"

    //         },

    //         "activités": {

    //             "habilité": "ok",

    //             "tauxRéalisationActivité": "ok",

    //             "tauxOccupationAccueilDeJour": "ok",

    //             "fileActivePersonnesAccompagnées": "no",

    //             "tauxOccupationHébergementPermanent": "ok",

    //             "tauxOccupationHébergementTemporaire": "ok",

    //             "nombreMoyenJournéesAbsencePersonnesAccompagnées": "no",

    //             "duréeMoyenneSéjourAccompagnementPersonnesSorties": "no"

    //         },

    //         "budgetEtFinances": {

    //             "habilité": "ok",

    //             "tauxDeCafNette": "ok",

    //             "compteRésultats": "ok",

    //             "fondsDeRoulement": "ok",

    //             "résultatNetComptable": "ok",

    //             "tauxDeVétustéConstruction": "ok",

    //             "contributionAuxFraisDeSiège": "ok"

    //         },

    //         "ressourcesHumaines": {

    //             "habilité": "ok",

    //             "tauxDEtpVacants": "no",

    //             "tauxDAbsentéisme": "ok",

    //             "nombreDEtpRéalisés": "ok",

    //             "nombreDeCddDeRemplacement": "ok",

    //             "tauxDePrestationsExternes": "no",

    //             "tauxDeRotationDuPersonnel": "no"

    //         },

    //         "autorisationsEtCapacités": {

    //             "habilité": "ok",

    //             "capacités": "ok",

    //             "autorisations": "ok"

    //         }

    //     }
    // }
}

const ProfileTable = () => {
    const [editableValues, setEditableValues] = useState({});

    useEffect(() => {
        // Set the initial state based on the profile object
        const initialEditableValues = {};

        const setInitialValues = (obj, prefix = '') => {
            Object.keys(obj).forEach(key => {
                const currentKey = prefix ? `${prefix} ${key}` : key;
                const value = obj[key];

                if (typeof value === 'object') {
                    setInitialValues(value, currentKey);
                } else if (typeof value === 'string' && (value === 'ok' || value === 'no')) {
                    initialEditableValues[currentKey] = value;
                }
            });
        };

        setInitialValues(profile);
        setEditableValues(initialEditableValues);
    }, [profile]);

    const handleCheckboxChange = (key, checked) => {
        setEditableValues({
            ...editableValues,
            [key]: checked ? 'ok' : 'no'
        });
    };
    console.log("editableValues", editableValues);

    const renderRows = (obj, prefix = '') => {
        return Object.keys(obj).map((key, index) => {
            const currentKey = prefix ? `${prefix} ${key}` : key;
            const value = typeof obj[key] === 'object'
                ? renderRows(obj[key], currentKey)
                : obj[key];

            return (
                <tr key={index}>
                    <td>{key}</td>
                    <td>
                        {typeof obj[key] === 'string' && (value === 'ok' || value === 'no') &&
                            <input
                                type="checkbox"
                                checked={editableValues[currentKey] === 'ok'}
                                onChange={(e) => handleCheckboxChange(currentKey, e.target.checked)}
                            />
                        }
                        {typeof obj[key] !== 'string' && value}
                    </td>
                </tr>
            );
        });
    };

    return (
        <table>
            <tbody>
                {renderRows(profile)}
            </tbody>
        </table>)
}

export const ParametrageProfilPage = () => {
    const { wording } = useDependencies();
    const { data } = useSession();
    // const { getAllProfiles, profiles } = useParametrage();
    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.PARAMETRAGE_TITRE}</h1>
            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                <ProfileTable />
            </div>
            <button className="fr-mt-2v fr-btn">
                Sauvegarder
            </button>
        </main >
    );
};