import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { ChangeEventHandler, useState } from "react";

import { getById } from "../../backend/infrastructure/controllers/userListEndpoint";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { BoutonActif, SelecteurTableauVignette } from "../../frontend/ui/commun/SelecteurTableauVignette/SelecteurTableauVignette";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import ListNameButton from "../../frontend/ui/user-list/ListNameButton";
import { GrilleListEtablissements } from "../../frontend/ui/liste/GrilleListEtablissements";
import { TableauListeEtablissements } from "../../frontend/ui/liste/TableauListeEtablissements";
import { UserListViewModel } from "../../frontend/ui/user-list/UserListViewModel";


type RouterProps = Readonly<{
  list: UserListViewModel;
}>;

export default function Router({ list }: RouterProps) {
  const { paths, wording } = useDependencies();
  const [displayTable, setDisplayTable] = useState(true);

  useBreadcrumb([
    {
      label: wording.FAVORIS_LIST,
      path: paths.MES_LISTES,
    },
    {
      label: list ? list.nom : wording.LISTE_NON_TROUVÉE,
      path: "",
    },
  ]);

  const activeAffichageTableau: ChangeEventHandler<HTMLInputElement> = (_event) => { setDisplayTable(true) };
  const activeAffichageTuile: ChangeEventHandler<HTMLInputElement> = (_event) => { setDisplayTable(false) };
  const listLength = list.userListEtablissements.length;
  const isListEmpty = () => listLength === 0;

  const titleHead = <>
    {!list.isFavoris ?
      <ListNameButton id={list.id} name={list.nom} /> :
      <h1>{list.nom}</h1>
    }
    <div className="fr-grid-row fr-mt-2w">
      <div className="fr-col">
        <p className="fr-table__detail">{"(" + listLength + ") établissements"}</p>
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
                  ? <TableauListeEtablissements list={list} />
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
          list: JSON.parse(JSON.stringify(list)),
        },
      };
    } else {
      return { notFound: true };
    }
  } catch (error) {
    return { notFound: true };
  }
}