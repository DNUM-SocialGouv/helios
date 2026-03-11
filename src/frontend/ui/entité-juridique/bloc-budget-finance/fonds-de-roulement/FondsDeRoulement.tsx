import { ReactElement } from "react";

import { FondsDeRoulementViewModel } from "./FondsDeRoulementViewModel";
import { annéesManquantes } from "../../../../utils/dateUtils";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import StringFormater from "../../../commun/StringFormater";

type FondsDeRoulementProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  fondsDeRoulementViewModel: FondsDeRoulementViewModel;
}>;

export function ContenuFondsDeRoulement(props: Readonly<{ dateDeMiseÀJour: any; source: ReactElement }>): ReactElement {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(props.source, props.dateDeMiseÀJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Le calcul du fonds de roulement permet d’apprécier l’adéquation des ressources aux emplois.
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
        <p>Différence entre les ressources stables (passif long terme) et les emplois stables (actif long terme)</p>
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

export function FondsDeRoulement({ etabFiness, etabTitle, fondsDeRoulementViewModel }: FondsDeRoulementProps): ReactElement {
  const { wording } = useDependencies();
  const infoBulleContenu = <ContenuFondsDeRoulement dateDeMiseÀJour={fondsDeRoulementViewModel.dateMiseÀJour} source={wording.ANCRE} />;
  const sourceName = wording.ANCRE;
  const anneesManquantes: number[] = annéesManquantes(fondsDeRoulementViewModel.années, 5);

  return fondsDeRoulementViewModel.auMoinsUnFondsDeRoulementRenseigné() ? (
    <IndicateurGraphique
      contenuInfoBulle={infoBulleContenu}
      dateDeMiseÀJour={fondsDeRoulementViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-fonds-de-roulement"
      nomDeLIndicateur={wording.FONDS_DE_ROULEMENT}
      source={sourceName}
    >
      <HistogrammeHorizontal
        couleursDeLHistogramme={fondsDeRoulementViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.roundFormatInFrench}
        identifiant={wording.FONDS_DE_ROULEMENT}
        libellés={fondsDeRoulementViewModel.années.map(String)}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={wording.FONDS_DE_ROULEMENT}
        nombreDeLibelléTotal={5}
        valeurs={fondsDeRoulementViewModel.valeurs}

      />
    </IndicateurGraphique>
  ) : (
    <></>
  );
}
