import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { FavorisPage } from "../frontend/ui/favoris/FavorisPage";

export default function Favoris() {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.FAVORIS_LIST,
            path: "",
        },
    ]);
    return <FavorisPage />;
}