import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { ChangeEventHandler, ReactNode, useContext, useEffect, useState } from "react";

import { getById } from "../../backend/infrastructure/controllers/userListEndpoint";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { UserContext } from "../../frontend/ui/commun/contexts/userContext";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { BoutonActif, SelecteurTableauVignette } from "../../frontend/ui/commun/SelecteurTableauVignette/SelecteurTableauVignette";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { Page404 } from "../../frontend/ui/erreurs/Page404";
import { useFavoris } from "../../frontend/ui/favoris/useFavoris";
import ExportList from "../../frontend/ui/liste/ExportList";
import { GrilleListEtablissements } from "../../frontend/ui/liste/GrilleListEtablissements";
import { ListActionsButton } from "../../frontend/ui/liste/ListActionsButton";
import { TableauListeEtablissements } from "../../frontend/ui/liste/TableauListeEtablissements";
import { Order, OrderBy } from "../../frontend/ui/liste/usePageListe";
import ListNameButton from "../../frontend/ui/user-list/ListNameButton";
import { UserListViewModel } from "../../frontend/ui/user-list/UserListViewModel";

const defaultOrder = Order.DESC.valueOf();
const defaultOrderBy = OrderBy.DATE_CREATION.valueOf();


type RouterProps = Readonly<{
  listServer: UserListViewModel;
}>;

export default function Router({ listServer }: RouterProps) {
  const userContext = useContext(UserContext);
  const { getFavorisLists } = useFavoris();
  const { paths, wording } = useDependencies();
  const [displayTable, setDisplayTable] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Map<string, string>>(new Map());
  const [list, setList] = useState<UserListViewModel>();
  const [chargement, setChargement] = useState(true);
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);

  // Quand la liste des favoris à été changée en local on la recharge depuis le server
  useEffect(() => {
    setChargement(true);
    fetch(`/api/liste/${listServer.id}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    }).then((response) => response.json())
      .then((data) => {
        setList(data);
        setChargement(false);
      });
  }, [userContext?.favorisLists])


  useBreadcrumb([
    {
      label: wording.FAVORIS_LIST,
      path: paths.MES_LISTES,
    },
    {
      label: listServer ? listServer.nom : wording.LISTE_NON_TROUVÉE,
      path: "",
    },
  ]);

  const listLength = list ? list.userListEtablissements.length : 0;

  // On recharge la liste des favoris dans le contexte à chaque changement d’affichage pour synchro les potentielles
  // Actions dans d’autres onglets et synchro le nombre d’elements dans le message avec le nombre de resultat dans la vue
  const activeAffichageTableau: ChangeEventHandler<HTMLInputElement> = (_event) => {
    setDisplayTable(true);
    getFavorisLists();
  };
  const activeAffichageTuile: ChangeEventHandler<HTMLInputElement> = (_event) => {
    setDisplayTable(false);
    getFavorisLists()
  };

  const tableMessage = `${selectedRows.size} ${selectedRows.size > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`;
  const vignetteMessage = `${listLength} ${listLength > 1 ? 'établissements' : 'établissement'}`;

  const isListEmpty = () => listLength === 0;

  let exportButton: ReactNode;
  if (list) {
    exportButton = <ExportList disabled={isListEmpty()} listId={list.id} listName={list.nom} order={order} orderBy={orderBy} />;
  } else {
    exportButton = <button className="fr-btn fr-btn--tertiary-no-outline" disabled={true}>
      {wording.EXPORTER}
    </button>;
  }

  const titleHead = <>
    <div className="fr-grid-row">
      {list && !list.isFavoris ?
        <ListNameButton id={list.id} name={list.nom} /> :
        <h1>{list?.nom}</h1>
      }
      {list && displayTable && <ListActionsButton disabledExport={isListEmpty()} exportButton={exportButton} listId={list.id} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />}
    </div>
    <div className="fr-grid-row fr-mt-2w">
      <div className="fr-col">
        <p className="fr-table__detail">{displayTable ? tableMessage : vignetteMessage}</p>
      </div>
      <div className="fr-col--right">
        <SelecteurTableauVignette defaultCheckedButton={displayTable ? BoutonActif.Tableau : BoutonActif.Vignette} disabled={isListEmpty()} onChangeToGrid={activeAffichageTuile} onChangeToTable={activeAffichageTableau} />
      </div>
    </div>
  </>;

  return (
    <>
      {list ? (
        <main className="fr-container" id="content">
          <section aria-label={wording.LISTE_DE_FAVORIS}>
            {titleHead}
            {!isListEmpty() &&
              <>
                {displayTable
                  ? <TableauListeEtablissements
                    list={list}
                    order={order}
                    orderBy={orderBy}
                    selectedRows={selectedRows}
                    setOrder={setOrder}
                    setOrderBy={setOrderBy}
                    setSelectedRows={setSelectedRows}
                  />
                  : <GrilleListEtablissements list={list} />
                }
              </>
            }
          </section>
        </main>
      ) : (
        <>
          {chargement ? (
            <Spinner />
          ) : (
            <Page404 />
          )}
        </>
      )}
    </>
  );
}

// Première recherche dans le back pour afficher directement la page 404 en cas de liste inexistante
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {

    const session = await getSession(context);
    const userUuid = session?.user?.idUser as string;
    if (context.params?.["id"]) {
      const listId = Number(context.params["id"]);

      const list = await getById(userUuid, listId);
      if (!list) {
        return { notFound: true };
      }

      return {
        props: {
          listServer: JSON.parse(JSON.stringify(list)),
        },
      };
    } else {
      return { notFound: true };
    }
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return { notFound: true };
  }
}
