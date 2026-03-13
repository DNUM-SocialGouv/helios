import { ReactElement } from "react";

import { BesoinFondsDeRoulementViewModel } from "./BesoinFondsDeRoulementViewModel";
import { annéesManquantes } from "../../../../utils/dateUtils";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import StringFormater from "../../../commun/StringFormater";

type BesoinFondsDeRoulementProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  besoinFondsDeRoulementViewModel: BesoinFondsDeRoulementViewModel;
}>;

export function ContenuBesoinFondsDeRoulement(props: Readonly<{ dateDeMiseÀJour: any; source: ReactElement }>): ReactElement {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(props.source, props.dateDeMiseÀJour)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Le Besoin en Fonds de Roulement (BFR) traduit le besoin de financement du cycle d’exploitation.
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
        <p>Différence entre l’actif circulant et le passif circulant</p>
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

export function BesoinFondsDeRoulement({ etabFiness, etabTitle, besoinFondsDeRoulementViewModel }: BesoinFondsDeRoulementProps): ReactElement {
  const { wording } = useDependencies();
  const infoBulleContenu = <ContenuBesoinFondsDeRoulement dateDeMiseÀJour={besoinFondsDeRoulementViewModel.dateMiseÀJour} source={wording.ANCRE} />;
  const sourceName = wording.ANCRE;
  const anneesManquantes: number[] = annéesManquantes(besoinFondsDeRoulementViewModel.années, 5);

  return besoinFondsDeRoulementViewModel.auMoinsUnBesoinFondsDeRoulementRenseigné() ? (
    <IndicateurGraphique
      contenuInfoBulle={infoBulleContenu}
      dateDeMiseÀJour={besoinFondsDeRoulementViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-besoin-fonds-de-roulement"
      nomDeLIndicateur={wording.BESOIN_FONDS_DE_ROULEMENT}
      source={sourceName}
    >
      <HistogrammeHorizontal
        couleursDeLHistogramme={besoinFondsDeRoulementViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        formateur={StringFormater.formatInEuro}
        identifiant={wording.BESOIN_FONDS_DE_ROULEMENT}
        libellés={besoinFondsDeRoulementViewModel.années.map(String)}
        libellésDeValeursManquantes={anneesManquantes}
        nomGraph={wording.BESOIN_FONDS_DE_ROULEMENT}
        nombreDeLibelléTotal={5}
        valeurs={besoinFondsDeRoulementViewModel.valeurs}
      />
    </IndicateurGraphique>
  ) : (
    <></>
  );
}
