import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { ParametrageProfilPage } from "../../frontend/ui/parametrage-profil/ParametrageProfilPage";

export default function ProfileId() {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.PARAMETRAGE_PROFILE,
            path: "",
        },
    ]);
    return <ParametrageProfilPage />;
}