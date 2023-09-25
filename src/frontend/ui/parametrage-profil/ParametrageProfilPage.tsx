import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./ParametrageProfil.module.css";
import { ProfileTabContent } from "./ProfileTabContent";


const profile = {
    "autreRegion": {
        "profilEJ": {
            "identité": {
                "nom": "ok",
                "siret": "ok",
                "adresse": "ok",
                "statut_EJ": "ok",
                "télEtEmail": "ok",
                "numéroFiness": "ok",
            },
            "activités": {
                "nombrePassage": "ok",
                "nombreSéjours": "no",
                "nombreJournées": "no",
                "nombreSéjoursHad": "ok"
            },
            "budgetEtFinance": {
                "tauxDeCafNette": "no",
                "compteRésultats": "ok",
                "résultatNetComptable": "no",
                "ratioDépendanceFinancière": "no"
            },
            "autorisationsEtCapacités": {
                "capacités": "ok",
                "autresActivités": "ok",
                "autorisationsActivités": "no",
                "equipementMaterielLourdsActivités": "no",
                "reconnaissanceContractuelleActivités": "ok"
            }
        },
        "profilETSanitaire": {
            "Qualité": {
                "missions": "ok",
                "vignette": "ok",
                "nombre_reclamation": "ok",
                "nombre_incident_encours": "ok",
                "nombre_EIAS/EIGS_encours": "ok",
                "nombre_incident_cloturé": "ok",
                "nombre_reclamation_motif": "ok",
                "nombre_EIAS/EIGS_cloturé": "ok"
            },
            "identité": {
                "nom": "ok",
                "siret": "ok",
                "adresse": "ok",
                "statut_EJ": "ok",
                "télEtEmail": "ok",
                "numéroFiness": "ok",
                "EJ_rattachement": "ok",
                "modeTarification": "ok",
                "catégorieÉtablissement": "ok"
            },
            "activités": {
                "nombrePassage": "ok",
                "nombreSéjours": "ok",
                "nombreJournées": "ok"
            },
            "autorisationsEtCapacités": {
                "capacités": "ok",
                "autresActivités": "no",
                "autorisationsActivités": "no",
                "equipementMaterielLourdsActivités": "no",
                "reconnaissanceContractuelleActivités": "no"
            }
        },
        "profilMédicoSocial":
        {
            "Qualité": {
                "missions": "ok",
                "vignette": "ok",
                "nombre_EIAS/EIGS": "ok",
                "nombre_reclamation": "ok",
                "nombre_incident_encours": "ok",
                "nombre_incident_cloturé": "ok",
                "nombre_reclamation_motif": "ok"
            },
            "identité": {
                "nom": "ok",
                "siret": "ok",
                "adresse": "ok",
                "statut_EJ": "ok",
                "télEtEmail": "ok",
                "numéroFiness": "ok",
                "EJ_rattachement": "ok",
                "modeTarification": "ok",
                "mono_établissement": "ok",
                "ET_principal_secondaire": "ok",
                "catégorieÉtablissement": "ok",
                "dateDEntréeEnVigueurDuCpom": "ok"
            },
            "activités": {
                "tauxRéalisationActivité": "ok",
                "tauxOccupationAccueilDeJour": "ok",
                "fileActivePersonnesAccompagnées": "no",
                "tauxOccupationHébergementPermanent": "ok",
                "tauxOccupationHébergementTemporaire": "ok",
                "nombreMoyenJournéesAbsencePersonnesAccompagnées": "no",
                "duréeMoyenneSéjourAccompagnementPersonnesSorties": "no"
            },
            "budgetEtFinances": {
                "tauxDeCafNette": "ok",
                "compteRésultats": "ok",
                "fondsDeRoulement": "ok",
                "résultatNetComptable": "ok",
                "tauxDeVétustéConstruction": "ok",
                "contributionAuxFraisDeSiège": "ok"
            },
            "ressourcesHumaines": {
                "tauxDEtpVacants": "no",
                "tauxDAbsentéisme": "ok",
                "nombreDEtpRéalisés": "ok",
                "nombreDeCddDeRemplacement": "ok",
                "tauxDePrestationsExternes": "no",
                "tauxDeRotationDuPersonnel": "no"
            },
            "autorisationsEtCapacités": {
                "capacités": "ok",
                "autorisations": "no"
            }
        }

    },
    "institution": {
        "profilEJ": {
            "identité": {
                "nom": "ok",
                "siret": "ok",
                "adresse": "ok",
                "statut_EJ": "ok",
                "télEtEmail": "ok",
                "numéroFiness": "ok"
            },
            "activités": {
                "nombrePassage": "ok",
                "nombreSéjours": "no",
                "nombreJournées": "no",
                "nombreSéjoursHad": "ok"
            },
            "budgetEtFinance": {
                "tauxDeCafNette": "no",
                "compteRésultats": "ok",
                "résultatNetComptable": "no",
                "ratioDépendanceFinancière": "no"
            },
            "autorisationsEtCapacités": {
                "capacités": "no",
                "autresActivités": "ok",
                "autorisationsActivités": "no",
                "equipementMaterielLourdsActivités": "no",
                "reconnaissanceContractuelleActivités": "ok"
            }
        },
        "profilETSanitaire": {
            "Qualité": {
                "missions": "ok",
                "vignette": "ok",
                "nombre_reclamation": "ok",
                "nombre_incident_encours": "ok",
                "nombre_EIAS/EIGS_encours": "ok",
                "nombre_incident_cloturé": "ok",
                "nombre_reclamation_motif": "ok",
                "nombre_EIAS/EIGS_cloturé": "ok"
            },

            "identité": {
                "nom": "ok",
                "siret": "ok",
                "adresse": "ok",
                "statut_EJ": "ok",
                "télEtEmail": "ok",
                "numéroFiness": "ok",
                "EJ_rattachement": "ok",
                "modeTarification": "ok",
                "catégorieÉtablissement": "ok"
            },
            "activités": {
                "nombrePassage": "ok",
                "nombreSéjours": "ok",
                "nombreJournées": "ok"
            },

            "autorisationsEtCapacités": {
                "capacités": "no",
                "autresActivités": "no",
                "autorisationsActivités": "no",
                "equipementMaterielLourdsActivités": "no",
                "reconnaissanceContractuelleActivités": "no"
            }
        },
        "profilMédicoSocial": {
            "Qualité": {
                "missions": "ok",
                "vignette": "ok",
                "nombre_EIAS/EIGS": "ok",
                "nombre_reclamation": "ok",
                "nombre_incident_encours": "ok",
                "nombre_incident_cloturé": "ok",
                "nombre_reclamation_motif": "ok"
            },
            "identité": {
                "nom": "ok",
                "siret": "ok",
                "adresse": "ok",
                "statut_EJ": "ok",
                "télEtEmail": "ok",
                "numéroFiness": "ok",
                "EJ_rattachement": "ok",
                "modeTarification": "ok",
                "mono_établissement": "ok",
                "ET_principal_secondaire": "ok",
                "catégorieÉtablissement": "ok",
                "dateDEntréeEnVigueurDuCpom": "ok"
            },
            "activités": {
                "tauxRéalisationActivité": "ok",
                "tauxOccupationAccueilDeJour": "ok",
                "fileActivePersonnesAccompagnées": "no",
                "tauxOccupationHébergementPermanent": "ok",
                "tauxOccupationHébergementTemporaire": "ok",
                "nombreMoyenJournéesAbsencePersonnesAccompagnées": "no",
                "duréeMoyenneSéjourAccompagnementPersonnesSorties": "no"
            },
            "budgetEtFinances": {
                "tauxDeCafNette": "ok",
                "compteRésultats": "ok",
                "fondsDeRoulement": "ok",
                "résultatNetComptable": "ok",
                "tauxDeVétustéConstruction": "ok",
                "contributionAuxFraisDeSiège": "ok"
            },
            "ressourcesHumaines": {
                "tauxDEtpVacants": "no",
                "tauxDAbsentéisme": "ok",
                "nombreDEtpRéalisés": "ok",
                "nombreDeCddDeRemplacement": "ok",
                "tauxDePrestationsExternes": "no",
                "tauxDeRotationDuPersonnel": "no"
            },
            "autorisationsEtCapacités": {
                "capacités": "ok",
                "autorisations": "ok",
            }
        }
    }
}

const ProfileTable = () => {
    const { wording } = useDependencies();

    return (
        <div className="fr-tabs">
            <ul aria-label="profiles-tab" className="fr-tabs__list" role="tablist">
                <li role="presentation">
                    <button aria-controls="tabpanel-EJ" aria-selected="true" className="fr-tabs__tab fr-tabs__tab--icon-left" id="tabpanel-404" role="tab">
                        {wording.PARAMETRAGE_EJ_TAB}
                    </button>
                </li>
                <li role="presentation">
                    <button aria-controls="tabpanel-ET-MS" aria-selected="false" className="fr-tabs__tab fr-tabs__tab--icon-left" id="tabpanel-405" role="tab">
                        {wording.PARAMETRAGE_ET_MS_TAB}
                    </button>
                </li>
                <li role="presentation">
                    <button aria-controls="tabpanel-ET-SAN" aria-selected="false" className="fr-tabs__tab fr-tabs__tab--icon-left" id="tabpanel-406" role="tab">
                        {wording.PARAMETRAGE_ET_SAN_TAB}
                    </button>
                </li>
            </ul>
            <ProfileTabContent autreRégion={profile.autreRegion.profilEJ} idTabPanel="tabpanel-EJ" institution={profile.institution.profilEJ} />
            <ProfileTabContent autreRégion={profile.autreRegion.profilMédicoSocial} idTabPanel="tabpanel-ET-MS" institution={profile.institution.profilMédicoSocial} />
            <ProfileTabContent autreRégion={profile.autreRegion.profilETSanitaire} idTabPanel="tabpanel-ET-SAN" institution={profile.institution.profilETSanitaire} />
        </div>
    )
}

export const ParametrageProfilPage = () => {
    const { wording } = useDependencies();
    // const { getAllProfiles, profiles } = useParametrage();
    return (
        <main className="fr-container">
            <h1 className={styles["title"]}>{wording.PARAMETRAGE_PROFILE}</h1>
            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
                <ProfileTable />
            </div>
            <button className="fr-mt-2v fr-btn">
                Sauvegarder
            </button>
        </main >
    );
};