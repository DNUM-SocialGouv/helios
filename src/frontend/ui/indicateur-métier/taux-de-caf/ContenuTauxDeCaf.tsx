import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuTauxDeCafProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuTauxDeCaf = ({ dateDeMiseÀJour, source }: ContenuTauxDeCafProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Cet indicateur traduit la capacité de l’établissement à dégager annuellement, grâce à son exploitation, les fonds nécessaires aux investissements. Le
          montant de la CAF peut être affecté au remboursement des emprunts, à l’investissement ou au renforcement des fonds propres de la structure en vue des
          investissements futurs. Un taux de CAF inférieur à 2% est un critère de déséquilibre financier.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
          <br />
          Capacité d’autofinancement (CAF) =
          <br />
          Résultat de l’exercice
          <br />
          <b>+ compte 68</b> « Dotations aux amortissements, aux dépréciations et aux provisions »
          <br />
          <b>− compte 78</b> « Reprises sur amortissements et provisions »
          <br />
          <b>− compte 775</b> « produit des cessions d’éléments d’actif »
          <br />
          <b>+ compte 675</b> « valeur comptable des éléments d’actif cédés » (M22) / « valeur des éléments d’actif cédés » (M21)
          <br />
          <b>− compte 777</b> « subventions d’investissement virées au résultat » (M22) / « Quote-part des subventions d’investissement virées au résultat »
          (M21)
          <br />
          <b>− compte 778</b> « Autres produits exceptionnels »
          <br />
          <b>/ Somme des comptes de classe 7 réalisés</b> (sauf c/775, c/777, c/7781 et c/78) - c/709 et c/713
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Caisse nationale de solidarité pour l’autonomie (CNSA)
        </p>
        <ul>
          <li>ERRD annexe 8 (feuilles « Ratios financiers »)</li>
          <li>ERRD annexe 11 (feuille « Fiche_Récap. »)</li>
          <li>CA PH (« Charges expl. » et « Produits expl. »)</li>
        </ul>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};
