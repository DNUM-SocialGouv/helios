import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { ChangeEvent, MouseEvent } from "react";

import { RechercheViewModel } from "./RechercheViewModel";
import { TableauEtablissements } from "./TableauEtablissements";
import { useDependencies } from "../commun/contexts/useDependencies";
import { GrilleEtablissements } from "../commun/GrilleEtablissements/GrilleEtablissements";
import { BoutonActif, SelecteurTableauVignette } from "../commun/SelecteurTableauVignette/SelecteurTableauVignette";

type RésultatsDeRechercheProps = Readonly<{
  estCeQueLesRésultatsSontTousAffichés: boolean;
  chargeLesRésultatsSuivants: () => void;
  nombreRésultats: number;
  résultats: RechercheViewModel[];
  termeFixe: string;
  rechercher: (terme: string, page: number, order?: string, orderBy?: string) => void;
  lancerLaRecherche: (event: MouseEvent | ChangeEvent<HTMLInputElement>, displayTable: boolean) => void;
  setDisplayTable: React.Dispatch<React.SetStateAction<boolean>>
  displayTable: boolean
}>;

export const RésultatsDeRecherche = ({
  estCeQueLesRésultatsSontTousAffichés,
  chargeLesRésultatsSuivants,
  nombreRésultats,
  résultats,
  termeFixe,
  rechercher,
  setDisplayTable,
  displayTable,
  lancerLaRecherche,
}: RésultatsDeRechercheProps) => {
  const { wording } = useDependencies();

  const activeAffichageTableau = (_event: ChangeEvent<HTMLInputElement>) => {
    setDisplayTable(true);
    lancerLaRecherche(_event, true)
  };

  const activeAffichageTuile = (_event: ChangeEvent<HTMLInputElement>) => {
    setDisplayTable(false);
    lancerLaRecherche(_event, false)
  };

  const isListEmpty = () => Number(nombreRésultats) === 0;

  const titleHead =
    <div className="fr-grid-row fr-mt-2w fr-grid-row--right">
      <div className="fr-col--right fr-mb-2w">
        <SelecteurTableauVignette defaultCheckedButton={displayTable ? BoutonActif.Tableau : BoutonActif.Vignette} disabled={isListEmpty()} onChangeToGrid={activeAffichageTuile} onChangeToTable={activeAffichageTableau} />
      </div>
    </div>

  return (
    <section aria-label={wording.RÉSULTAT_DE_RECHERCHE}>
      {isListEmpty() ?
        <p className="fr-h6 fr-mt-4w">
          {wording.aucunRésultat(termeFixe)}
        </p>
        :
        <>
          <p className="fr-h6 fr-mt-4w">
            {wording.rechercheNombreRésultats(nombreRésultats, termeFixe)}
          </p>
          {titleHead}
          {displayTable
            ? <TableauEtablissements displayTable={displayTable} nombreRésultats={nombreRésultats} rechercher={rechercher} résultats={résultats} terme={termeFixe} />
            : <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} estCeQueLesRésultatsSontTousAffichés={estCeQueLesRésultatsSontTousAffichés} isSimpleSearch={true} résultats={résultats} />
          }
        </>
      }
    </section>
  );
};
