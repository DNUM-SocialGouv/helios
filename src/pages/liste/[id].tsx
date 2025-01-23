import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";

import { UserListModel } from "../../../database/models/UserListModel";
import { rechercheParNumeroFinessEndpoint } from "../../backend/infrastructure/controllers/rechercheParNumeroFinessEndpoints";
import { getById } from "../../backend/infrastructure/controllers/userListEndpoint";
import { Résultat } from "../../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { GrilleEtablissements } from "../../frontend/ui/commun/GrilleEtablissements/GrilleEtablissements";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { TuileEtablissementViewModel } from "../../frontend/ui/commun/TuileEtablissement/TuileEtablissementViewModel";

type RouterProps = Readonly<{
  list: UserListModel;
  etablissements: Résultat[];
}>;

export default function Router({ list, etablissements }: RouterProps) {
  const { paths, wording } = useDependencies();
  const [resultSize, setResultSize] = useState(12);

  useBreadcrumb([
    {
      label: "lists",
      path: "TODO",
    },
    {
      label: list ? list.nom : "Not found", // TODO Wording
      path: "",
    },
  ]);

  if (!list) return null;

  const elements = etablissements.map((elmt) => {
    return new TuileEtablissementViewModel(elmt, paths);
  });

  const chargeLesRésultatsSuivants = () => {
    setResultSize(Math.min(resultSize + 12, elements.length));
  }
  const tousLesRésultatsSontAffichés = () => {
    return resultSize >= elements.length;
  }

  const titleHead = <>
    <h1>
      {list.nom}
    </h1>
    <div className="fr-grid-row fr-mt-2w">
      <div className="fr-col">
        <p className="fr-table__detail">{"(" + elements.length + ") établissements"}</p>
      </div>
      <div className="fr-col--right">
        <fieldset className="fr-segmented fr-segmented--no-legend fr-segmented--sm">
          <legend className="fr-segmented__legend">
            Légende
          </legend>
          <div className="fr-segmented__elements">
            <div className="fr-segmented__element">
              <input disabled id="display-format-table" name="display-format" type="radio" value="1" />
              <label className="fr-icon-table-line fr-label" htmlFor="display-format-table">
                Tableau
              </label>
            </div>
            <div className="fr-segmented__element">
              <input checked id="display-format-tile" name="display-format" type="radio" value="2" />
              <label className="fr-icon-layout-grid-line fr-label" htmlFor="display-format-tile">
                Vignette
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </>;

  return (
    <>
      {list ? (
        <main className="fr-container">
          <section aria-label={wording.RÉSULTAT_DE_RECHERCHE}>
            {titleHead}
            <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} currentListId={list.id} estCeQueLesRésultatsSontTousAffichés={tousLesRésultatsSontAffichés()} rafraichitAuRetraitFavoris={true} résultats={elements.slice(0, resultSize)} />
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
    if (context.params && context.params["id"]) {
      const listId = Number(context.params["id"]);

      const list = await getById(userUuid, listId);
      if (!list) {
        return { notFound: true };
      }

      const finessNumber = list?.userListEtablissements.map((etablissement) => etablissement.finessNumber);
      const etablissementList = await rechercheParNumeroFinessEndpoint(finessNumber);


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