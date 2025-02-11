import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";

import { getById } from "../../backend/infrastructure/controllers/userListEndpoint";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { UserContext } from "../../frontend/ui/commun/contexts/userContext";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { BoutonActif, SelecteurTableauVignette } from "../../frontend/ui/commun/SelecteurTableauVignette/SelecteurTableauVignette";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { SelectedRows } from "../../frontend/ui/commun/Table/Table";
import { useFavoris } from "../../frontend/ui/favoris/useFavoris";
import { GrilleListEtablissements } from "../../frontend/ui/liste/GrilleListEtablissements";
import { ListActionsButton } from "../../frontend/ui/liste/ListActionsButton";
import { TableauListeEtablissements } from "../../frontend/ui/liste/TableauListeEtablissements";
import ListNameButton from "../../frontend/ui/user-list/ListNameButton";
import { UserListViewModel } from "../../frontend/ui/user-list/UserListViewModel";


type RouterProps = Readonly<{
  listServer: UserListViewModel;
}>;

export default function Router({ listServer }: RouterProps) {
  const userContext = useContext(UserContext);
  const { getFavorisLists } = useFavoris();
  const { paths, wording } = useDependencies();
  const [displayTable, setDisplayTable] = useState(true);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>({ 1: [] });
  const [list, setList] = useState<UserListViewModel>();

  // Quand la liste des favoris à été changée en local on la recharge depuis le server
  useEffect(() => {
    fetch(`/api/liste/${listServer.id}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    }).then((response) => response.json())
      .then((data) => {
        setList(data);
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

  const selectedRowsValues = Object.values(selectedRows).flat();
  const tableMessage = `${selectedRowsValues.length} ${selectedRowsValues.length > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`;
  const vignetteMessage = `${listLength} ${listLength > 1 ? 'établissements' : 'établissement'}`;

  const isListEmpty = () => listLength === 0;

  const titleHead = <>
    <div className="fr-grid-row">
      {list && !list.isFavoris ?
        <ListNameButton id={list.id} name={list.nom} /> :
        <h1>{list?.nom}</h1>
      }
      {displayTable && <ListActionsButton selectedRows={selectedRowsValues} />}
    </div>
    <div className="fr-grid-row fr-mt-2w">
      <div className="fr-col">
        <p className="fr-table__detail">{displayTable ? tableMessage : vignetteMessage}</p>
      </div>
      <div className="fr-col--right">
        <SelecteurTableauVignette defaultCheckedButton={BoutonActif.Tableau} disabled={isListEmpty()} onChangeToGrid={activeAffichageTuile} onChangeToTable={activeAffichageTableau} />
      </div>
    </div>
  </>;

  return (
    <>
      {list ? (
        <main className="fr-container">
          <section aria-label={wording.LISTE_DE_FAVORIS}>
            {titleHead}
            {!isListEmpty() &&
              <>
                {displayTable
                  ? <TableauListeEtablissements list={list} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
                  : <GrilleListEtablissements list={list} />
                }
              </>
            }
          </section>
        </main>
      ) : (
        <Spinner />
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
  } catch (error) {
    return { notFound: true };
  }
}