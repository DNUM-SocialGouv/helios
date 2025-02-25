import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { ChangeEvent, MouseEvent, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { GrilleEtablissements } from "../commun/GrilleEtablissements/GrilleEtablissements";
import { BoutonActif, SelecteurTableauVignette } from "../commun/SelecteurTableauVignette/SelecteurTableauVignette";
import { SelectedRows } from "../commun/Table/Table";
import { RechercheViewModel } from "./RechercheViewModel";
import { TableauEtablissements } from "./TableauEtablissements";

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
  const [selectedRows, setSelectedRows] = useState<SelectedRows>({ 1: [] });

  const activeAffichageTableau = (_event: ChangeEvent<HTMLInputElement>) => {
    setDisplayTable(true);
    lancerLaRecherche(_event, true)
  };

  const activeAffichageTuile = (_event: ChangeEvent<HTMLInputElement>) => {
    setDisplayTable(false);
    lancerLaRecherche(_event, false)
  };

  const etsLength = résultats ? résultats.length : 0;

  const selectedRowsValues = Object.values(selectedRows).flat();
  const tableMessage = `${selectedRowsValues.length} ${selectedRowsValues.length > 1 ? 'établissements sélectionnés' : 'établissement sélectionné'}`;
  const vignetteMessage = `${etsLength} ${etsLength > 1 ? 'établissements' : 'établissement'}`;

  const isListEmpty = () => Number(nombreRésultats) === 0;

  const titleHead =
    <div className="fr-grid-row fr-mt-2w">
      <div className="fr-col">
        <p className="fr-table__detail">{displayTable ? tableMessage : vignetteMessage}</p>
      </div>
      <div className="fr-col--right">
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
            ? <TableauEtablissements displayTable={displayTable} nombreRésultats={nombreRésultats} rechercher={rechercher} résultats={résultats} selectedRows={selectedRows} setSelectedRows={setSelectedRows} terme={termeFixe} />
            : <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} estCeQueLesRésultatsSontTousAffichés={estCeQueLesRésultatsSontTousAffichés} résultats={résultats} />
          }
        </>
      }
    </section>
  );
};
