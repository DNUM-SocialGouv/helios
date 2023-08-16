import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ProfilePage } from "../frontend/ui/profile/ProfilePage";

export default function Profile() {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.PROFILE,
            path: "",
        },
    ]);

    return <ProfilePage />;
}
