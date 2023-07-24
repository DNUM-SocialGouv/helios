import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { SearchHistoryPage } from "../frontend/ui/search-history/SearchHistoryPage";

export default function Favoris() {
    useBreadcrumb([]);
    return <SearchHistoryPage />;
}