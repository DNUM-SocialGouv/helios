import { GetServerSidePropsContext, GetStaticPropsResult } from "next";

import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { GrilleEtablissements } from "../../frontend/ui/commun/GrilleEtablissements/GrilleEtablissements";
import { TuileEtablissementViewModel } from "../../frontend/ui/commun/TuileEtablissement/TuileEtablissementViewModel";
import { listenerCount } from "process";
import { useState } from "react";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";

class List {
  constructor(readonly name: string, readonly elements: ListElement[]) { }
}

class ListElement {
  constructor(readonly commune: string,
    readonly département: string,
    readonly numéroFiness: string,
    readonly raisonSocialeCourte: string,
    readonly type: string,
    readonly rattachement: string) { };
}

type RouterProps = Readonly<{
  list: List;
}>;

export default function Router({ list }: RouterProps) {
  const { paths, wording } = useDependencies();
  const [resultSize, setResultSize] = useState(12);

  useBreadcrumb([
    {
      label: "lists",
      path: "TODO",
    },
    {
      label: list ? list.name : "Not found", // TODO Wording
      path: "",
    },
  ]);

  if (!list) return null;

  const elements = list.elements.map((elmt) => {
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
      {list.name}
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
            <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} estCeQueLesRésultatsSontTousAffichés={tousLesRésultatsSontAffichés()} résultats={elements.slice(0, resultSize)} />
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
    // TODO Get the real list
    if (context.params && context.params["id"]) {
      const listId = context.params["id"] as string;

      const list = getResults(listId);

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

function getResults(listId: string): List {
  const listElements = [
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
    new ListElement("Paris", "Paris 9e  Arrondissement", listId, "Udaf de Paris", "type", "rattachement"),
  ];
  return new List("test", listElements);

}