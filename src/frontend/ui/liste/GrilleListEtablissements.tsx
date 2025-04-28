import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { useContext, useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { GrilleEtablissements } from "../commun/GrilleEtablissements/GrilleEtablissements";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { UserListViewModel } from "../user-list/UserListViewModel";
import { Order, OrderBy } from "./usePageListe";

const PAGE_SIZE = 12;
const ORDER = Order.ASC;
const ORDER_BY = OrderBy.NUMERO_FINESS;

type GrilleListEtablissementsProps = Readonly<{
    list: UserListViewModel;
}>;

export const GrilleListEtablissements = ({
    list,
}: GrilleListEtablissementsProps) => {
    const { paths } = useDependencies();
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [dataOnPage, setDataOnPage] = useState<RechercheViewModel[]>([])

    const userContext = useContext(UserContext);
    const favorisList = userContext?.favorisLists.find(favList => favList.id === list.id)?.userListEtablissements || [];

    const etablissements = list.userListEtablissements;

    useEffect(() => {
        const queryParams = new URLSearchParams({
            order: ORDER,
            orderBy: ORDER_BY,
            page: "1",
            limit: String(limit),
        });
        fetch(`/api/liste/${list.id}/etablissement?${queryParams.toString()}`,
            {
                headers: { "Content-Type": "application/json" },
                method: "GET",
            })
            .then((response) => response.json())
            .then((data) => {
                setDataOnPage(data.map((résultat: any) => new RechercheViewModel(résultat, paths)));
            });
    }, [list, favorisList, limit])

    const estCeQueLesRésultatsSontTousAffichés = () => {
        return limit >= etablissements.length
    };
    const chargeLesRésultatsSuivants = () => setLimit(limit + PAGE_SIZE);

    return (
        <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} currentListId={list.id} estCeQueLesRésultatsSontTousAffichés={estCeQueLesRésultatsSontTousAffichés()} résultats={dataOnPage} />
    );
};
