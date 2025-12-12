import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuDuNombreDeSéjourMCOProps = Readonly<{
  annuel: boolean;
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuDureeMoyenneDeSejourMCO = ({ annuel, dateDeMiseÀJour, source }: ContenuDuNombreDeSéjourMCOProps) => {
  const { wording } = useDependencies();
  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>Synthétise la sur ou sous performance de l’organisation médicale de l’établissement en médecine (hors ambulatoire), de l’activité de chirurgie (hors ambulatoire), de l’activité de l’obstétrique (hors ambulatoire)</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> {annuel ? "Annuelle" : "Mensuelle"}
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
          <br />
          Numérateur: Nombre de journées de médecine/chirurgie/obstétrique réalisées :  les séjours d’au moins une nuit sont pris en compte, les séjours classés en erreur et les prestations inter établissement ainsi que les établissements qui ne sont pas T2A en 2013 sont exclus
          <br />
          <br />
          Pour Médecine: Nombre de journées réalisées ASO hors CMD15
          <br />
          <br />
          Pour Chirurgie: Nombre de journées réalisées ASO=C
          <br />
          <br />
          Pour Obstétrique: Nombre de journées réalisées ASO O
          <br />
          <br />
          Dénominateur: Nombre de journées de médecine/chirurgie/obstétrique théoriques: correspond au case mix de l’établissement multiplié par la DMS nationale de chacun des groupes homogènes de malades (GHM)
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
        </p>
        <ul>
          <li>Programme de médicalisation des systèmes d’information (PMSI) - Agence technique de l’information sur l’hospitalisation (ATIH)</li>
        </ul>
      </section>
      <br />
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Dans le cadre du PMSI, tout séjour dans un établissement de santé, public ou privé,
          fait l’objet d’un recueil systématique et minimal d’informations administratives et médicales qui sont utilisées principalement pour le financement des établissements de santé (tarification à l’activité) et pour l’organisation de l’offre de soins (planification).
        </p>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. »,
          outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};
