import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { ChangeEventHandler, useState } from "react";

import { rechercheParNumeroFinessEndpoint } from "../../backend/infrastructure/controllers/rechercheParNumeroFinessEndpoints";
import { getById } from "../../backend/infrastructure/controllers/userListEndpoint";
import { Résultat } from "../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { GrilleEtablissements } from "../../frontend/ui/commun/GrilleEtablissements/GrilleEtablissements";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { BoutonActif, SelecteurTableauVignette } from "../../frontend/ui/commun/SelecteurTableauVignette/SelecteurTableauVignette";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { TableauListeEtablissements } from "../../frontend/ui/liste/TableauListeEtablissements";
import { TableauListEtalblissementViewModel } from "../../frontend/ui/liste/TableauListEtablissementViewModel";
import { UserListViewModel } from "../../frontend/ui/user-list/UserListViewModel";

type RouterProps = Readonly<{
  list: UserListViewModel;
  etablissements: Résultat[];
}>;

export default function Router({ list, etablissements }: RouterProps) {
  const { paths, wording } = useDependencies();
  const [resultSize, setResultSize] = useState(12);
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

  if (!list) return null;

  const elements = etablissements.map((elmt) => {
    return new RechercheViewModel(elmt, paths);
  });

  const finessDateMap: Map<string, Date> = new Map();
  list.userListEtablissements.forEach(etablissement => {
    finessDateMap.set(etablissement.finessNumber, etablissement.dateCreation);
  });
  
  const elementsTableau = elements.flatMap(elmt => {
    const dateCreation = finessDateMap.get(elmt.numéroFiness);
    if(dateCreation){
      return new TableauListEtalblissementViewModel(elmt, dateCreation);
    } else {
      return [];
    }
  });

  const chargeLesRésultatsSuivants = () => {
    setResultSize(Math.min(resultSize + 12, elements.length));
  }
  const tousLesRésultatsSontAffichés = () => {
    return resultSize >= elements.length;
  }

  const activeAffichageTableau: ChangeEventHandler<HTMLInputElement> = (_event) => { setDisplayTable(true) };
  const activeAffichageTuile: ChangeEventHandler<HTMLInputElement> = (_event) => { setDisplayTable(false) };

  const titleHead = <>
    <h1>
      {list.nom}
    </h1>
    <div className="fr-grid-row fr-mt-2w">
      <div className="fr-col">
        <p className="fr-table__detail">{"(" + elements.length + ") établissements"}</p>
      </div>
      <div className="fr-col--right">
        <SelecteurTableauVignette defaultCheckedButton={BoutonActif.Tableau} onChangeToGrid={activeAffichageTuile} onChangeToTable={activeAffichageTableau} />
      </div>
    </div>
  </>;

  return (
    <>
      {list ? (
        <main className="fr-container">
          <section aria-label={wording.LISTE_DE_FAVORIS}>
            {titleHead}
            {displayTable
              ? <TableauListeEtablissements rawData={elementsTableau} />
              : <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} currentListId={list.id} estCeQueLesRésultatsSontTousAffichés={tousLesRésultatsSontAffichés()} rafraichitAuRetraitFavoris={true} résultats={elements.slice(0, resultSize)} />
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

      const finessNumber = list?.userListEtablissements.map((etablissement) => etablissement.finessNumber);
      const etablissementList = (await rechercheParNumeroFinessEndpoint(finessNumber)).sort((a, b) => a.numéroFiness.localeCompare(b.numéroFiness));


      return {
        props: {
          list: JSON.parse(JSON.stringify(list)),
          etablissements: etablissementList,
        },
      };
    } else {
      return { notFound: true };
    }
  } catch (error) {
    return { notFound: true };
  }
}