import { ReactElement } from "react";

import { TresorerieViewModel } from "./TresorerieViewModel";
import { annéesManquantes } from "../../../../utils/dateUtils";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import StringFormater from "../../../commun/StringFormater";

type TresorerieProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  tresorerieViewModel: TresorerieViewModel;
}>;

export function ContenuTresorerie(props: Readonly<{ dateDeMiseÀJour: any; source: ReactElement }>): ReactElement {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(props.source, props.dateDeMiseÀJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          La trésorerie désigne les liquidités ou quasi liquidités dont dispose l’établissement à un moment donné.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Quotidienne
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
        </p>
        <p>Trésorerie = Fonds de roulement - Besoin en fonds de roulement</p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> ANCRE (Application Nationale Compte financier Rapport infra-annuel Eprd) - Agence technique de l’information sur l’hospitalisation (ATIH)</p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation », outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
}

export function Tresorerie({ etabFiness, etabTitle, tresorerieViewModel }: TresorerieProps): ReactElement {
  const { wording } = useDependencies();
  const infoBulleContenu = <ContenuTresorerie dateDeMiseÀJour={tresorerieViewModel.dateMiseÀJour} source={wording.ANCRE} />;
  const sourceName = wording.ANCRE;
  const anneesManquantes: number[] = annéesManquantes(tresorerieViewModel.années, 5);

  return tresorerieViewModel.auMoinsUneTresorerieRenseignée() ? (
    <IndicateurGraphique
      contenuInfoBulle={infoBulleContenu}
      dateDeMiseÀJour={tresorerieViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-tresorerie"
      nomDeLIndicateur={wording.TRESORERIE}
      source={sourceName}
    >
      <HistogrammeHorizontal
        couleursDeLHistogramme={tresorerieViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={wording.TRESORERIE}
        libellés={tresorerieViewModel.années.map(String)}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={wording.TRESORERIE}
        nombreDeLibelléTotal={5}
        valeurs={tresorerieViewModel.valeurs}
      />
    </IndicateurGraphique>
  ) : (
    <></>
  );
}
