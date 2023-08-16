import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { SearchHistoryPage } from "../frontend/ui/search-history/SearchHistoryPage";

export default function Favoris() {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.HISTORIQUE_DE_RECHERECHE_TITRE,
            path: "",
        },
    ]);
    return <SearchHistoryPage />;
}