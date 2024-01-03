import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { useDependencies } from "../commun/contexts/useDependencies";
import { ProfileTabContent } from "./ProfileTabContent";
import { useParametrage } from "./useParametrage";


type ProfileTableProps = Readonly<{
    codeValue: string,
    profileValue: ProfileValue;
    creating: boolean;
    name: string;
}>;

export const ProfileTable = ({ codeValue, profileValue, creating, name }: ProfileTableProps) => {
    const { wording, paths } = useDependencies();
    const { data } = useSession();
    const router = useRouter();
    const [userId, setUserId] = useState('');

    const { updateProfile, saveProfile } = useParametrage();
    const [editableInstitutionEJValues, setEditableInstitutionEJValues] = useState<any>(profileValue.institution.profilEJ);
    const [editableAutreRegionEJValues, setEditableAutreRegionEJValues] = useState<any>(profileValue.autreRegion.profilEJ);

    const [editableInstitutionETMSValues, setEditableInstitutionETMSValues] = useState<any>(profileValue.institution.profilMédicoSocial);
    const [editableAutreRegionETMSValues, setEditableAutreRegionETMSValues] = useState<any>(profileValue.autreRegion.profilMédicoSocial);

    const [editableInstitutionETSANValues, setEditableInstitutionETSANValues] = useState<any>(profileValue.institution.profilETSanitaire);
    const [editableAutreRegionETSANValues, setEditableAutreRegionETSANValues] = useState<any>(profileValue.autreRegion.profilETSanitaire);

    useEffect(() => {
        if (data) {
            setUserId(data.user.idUser);
        }
    }, [data]);


    const saveButtonClick = () => {
        if (creating) {
            saveProfile(userId, codeValue, {
                institution: {
                    profilEJ: editableInstitutionEJValues,
                    profilMédicoSocial: editableInstitutionETMSValues,
                    profilETSanitaire: editableInstitutionETSANValues,
                },
                autreRegion: {
                    profilEJ: editableAutreRegionEJValues,
                    profilMédicoSocial: editableAutreRegionETMSValues,
                    profilETSanitaire: editableAutreRegionETSANValues,
                },
            });
        } else {
            updateProfile(userId, codeValue, {
                institution: {
                    profilEJ: editableInstitutionEJValues,
                    profilMédicoSocial: editableInstitutionETMSValues,
                    profilETSanitaire: editableInstitutionETSANValues,
                },
                autreRegion: {
                    profilEJ: editableAutreRegionEJValues,
                    profilMédicoSocial: editableAutreRegionETMSValues,
                    profilETSanitaire: editableAutreRegionETSANValues,
                },
            });
        }
    };

    const cancelButtonClick = () => {
        router.push(paths.PROFILES_LIST);
    }

    const deleteButtonClick = () => {

    }

    return (
        <div>
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
                <ProfileTabContent editableAutreRegionValues={editableAutreRegionEJValues} editableInstitutionValues={editableInstitutionEJValues} idTabPanel="tabpanel-EJ" setEditableAutreRegionValues={setEditableAutreRegionEJValues} setEditableInstitutionValues={setEditableInstitutionEJValues} />
                <ProfileTabContent editableAutreRegionValues={editableAutreRegionETMSValues} editableInstitutionValues={editableInstitutionETMSValues} idTabPanel="tabpanel-ET-MS" setEditableAutreRegionValues={setEditableAutreRegionETMSValues} setEditableInstitutionValues={setEditableInstitutionETMSValues} />
                <ProfileTabContent editableAutreRegionValues={editableAutreRegionETSANValues} editableInstitutionValues={editableInstitutionETSANValues} idTabPanel="tabpanel-ET-SAN" setEditableAutreRegionValues={setEditableAutreRegionETSANValues} setEditableInstitutionValues={setEditableInstitutionETSANValues} />
            </div>
            <div className="fr-grid-row fr-mt-2w">
                <button className="fr-btn fr-mr-2w" onClick={() => saveButtonClick()}>
                    Sauvegarder
                </button>
                <button className="fr-btn fr-mr-2w" onClick={() => cancelButtonClick()}>
                    Annuler
                </button>
                <button className="fr-btn" onClick={() => deleteButtonClick()}>
                    Supprimer l&apos;autorisation
                </button>
            </div>
        </div>
    )
}

