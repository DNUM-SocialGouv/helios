import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { FavorisPage } from "../frontend/ui/favoris/FavorisPage";

export default function Favoris() {
    useBreadcrumb([]);
    return <FavorisPage />;
}