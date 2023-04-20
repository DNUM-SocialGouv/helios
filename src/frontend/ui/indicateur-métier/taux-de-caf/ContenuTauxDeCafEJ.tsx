import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuTauxDeCafProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuTauxDeCafEJ = ({ dateDeMiseÀJour, source }: ContenuTauxDeCafProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Cet indicateur mesure la capacité de l’établissement à autofinancer ses investissements. Il mesure la part de CAF qui reste disponible après
          remboursement de l’annuité en capital de la dette. Une CAF &lt; 0 traduit une insuffisance d’autofinancement. Un taux de CAF inférieur à 2% est un
          critère de déséquilibre financier.
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
          <p className="fr-text--bold">Mode de calcul : </p>
          <p className="fr-text--bold">Numérateur - Capacité d’autofinancement (CAF) :</p>
          <p>
            Annuité de remboursement du capital de la dette = Total des débits des comptes 16 « Emprunts et dettes assimilées », sauf 1688 &quot;intérêts courus
            non échus&quot; après retraitement des débits afférents aux renégociations d’emprunts, aux remboursements anticipés des emprunts et aux opérations
            de l’année sur les ouvertures de crédits long terme renouvelables (OCLTR) qui sont déduits de manière à obtenir l’« image » de l’annuité réelle de
            la dette, 166 « Refinancement de la dette » et 16449 « Opérations afférentes à l’option de tirage sur ligne de trésorerie ».
          </p>
          <p className="fr-text--bold">Dénominateur - Solde des comptes :</p>
          <p>Produits d’exploitation (70 à 75 +781+791-sd709)</p>
          <p>+ Produits financiers (76)</p>
          <p>+ Produits exceptionnels (77 + 7874 + 7876 + 797)</p>
          <p>- 775 « Produits des cessions d’immobilisations »</p>
          <p>- 777 « Quote-part des subventions amortissables transférées au compte de résultat »</p>
          <p>- 78 « Reprises sur amortissements et provisions »</p>
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          <p>ANCRE (Application Nationale Compte financier Rapport infra-annuel Eprd) - Agence technique de l’information sur l’hospitalisation (ATIH)</p>
        </p>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};
