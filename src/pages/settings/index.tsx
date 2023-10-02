import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { ParametragePage } from "../../frontend/ui/parametrage-profil/ParametragePage";

const Parametrage = () => {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.PARAMETRAGE_TITRE,
            path: "",
        },
    ]);
    return <ParametragePage />;
}

export default Parametrage;