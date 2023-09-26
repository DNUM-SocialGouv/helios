import { ProfileValue } from "../../../../database/models/ProfilModel";
import { useDependencies } from "../commun/contexts/useDependencies";
import { ProfileTabContent } from "./ProfileTabContent";

type ProfileTableProps = Readonly<{
    profileValue: ProfileValue;
}>;

export const ProfileTable = ({ profileValue }: ProfileTableProps) => {
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
            <ProfileTabContent autreRégion={profileValue.autreRegion.profilEJ} idTabPanel="tabpanel-EJ" institution={profileValue.institution.profilEJ} />
            <ProfileTabContent autreRégion={profileValue.autreRegion.profilMédicoSocial} idTabPanel="tabpanel-ET-MS" institution={profileValue.institution.profilMédicoSocial} />
            <ProfileTabContent autreRégion={profileValue.autreRegion.profilETSanitaire} idTabPanel="tabpanel-ET-SAN" institution={profileValue.institution.profilETSanitaire} />
        </div>
    )
}