import React, { ReactElement } from "react";

import { RatioDependanceFinanciereViewModel } from "./RatioDependanceFinanciereViewModel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammeVertical } from "../../../commun/Graphique/HistogrammeVertical";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";

type RationDependanceFinanciereProps = Readonly<{
  ratioDependanceFinanciereViewModel: RatioDependanceFinanciereViewModel;
}>;

function ContenuRatioDependanceFinancière(props: { dateDeMiseÀJour: any; source: ReactElement }): ReactElement {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(props.dateDeMiseÀJour, props.source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Cet indicateur mesure le poids que représente l’endettement de l’établissement dans les capitaux permanents (ressources du fonds de roulement hors
          amortissements et dépréciations). Un taux supérieur à 50% traduit une trop forte dépendance vis-à-vis des organismes prêteurs.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Quotidienne
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
        </p>
        <p className="fr-text--bold">Numérateur - Encours de la dette au 31.12.N</p>
        <p>
          Compte 163 « Emprunts obligataires » + Compte 164 « Emprunts auprès des établissements de crédit » + Comptes 165 à 168 « Emprunts et dettes
          financières divers » Les comptes 166 et 168 sont déduits.
        </p>
        <p className="fr-text--bold">Dénominateur - Capitaux permanents</p>
        <p>Soldes créditeurs des comptes : </p>
        <p>
          10 « Apports, dotations, réserves » <br />
          + 11 « Report à nouveau »<br />
          + 12 « Résultat de l’exercice »<br />
          + 13 « Subventions d’investissement »<br />
          + 14 « Provisions réglementées »<br />
          + 15 « Provisions pour risques et charges »<br />
          + 163 « Emprunts obligataires »<br />
          + 164 « Emprunts auprès des établissements de crédit »<br />
          + 165 à 168 « Emprunts et dettes financières divers »<br />
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          ANCRE (Application Nationale Compte financier Rapport infra-annuel Eprd) - Agence technique de l’information sur l’hospitalisation (ATIH)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
}

export function RatioDependanceFinanciere({ ratioDependanceFinanciereViewModel }: RationDependanceFinanciereProps): ReactElement {
  const { wording } = useDependencies();
  const infoBulleContenu = <ContenuRatioDependanceFinancière dateDeMiseÀJour={ratioDependanceFinanciereViewModel.dateMiseÀJour} source={wording.ANCRE} />;
  const sourceName = wording.ANCRE;



  return ratioDependanceFinanciereViewModel.auMoinsUnRatioRenseigné() ? (
    <IndicateurGraphique
      contenuInfoBulle={infoBulleContenu}
      dateDeMiseÀJour={ratioDependanceFinanciereViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-ratio-dependance-financiere"
      nomDeLIndicateur={wording.RATIO_DEPENDANCE_FINANCIERE}
      source={sourceName}
    >
      <HistogrammeVertical
        annéesTotales={ratioDependanceFinanciereViewModel.NOMBRE_ANNEES}
        couleurDesLibelles={ratioDependanceFinanciereViewModel.construisLesCouleursDesLibelles()}
        couleursDeLHistogramme={ratioDependanceFinanciereViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        identifiant={wording.RATIO_DEPENDANCE_FINANCIERE}
        libellés={ratioDependanceFinanciereViewModel.années}
        taillePoliceTicks={ratioDependanceFinanciereViewModel.construisLesLibellésDesTicks()}
        valeurs={ratioDependanceFinanciereViewModel.valeurs}
      />
    </IndicateurGraphique>
  ) : (
    <></>
  );
}
