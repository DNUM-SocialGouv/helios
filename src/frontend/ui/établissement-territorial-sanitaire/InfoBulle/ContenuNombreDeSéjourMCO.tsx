import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuDuNombreDeSéjourMCOProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
  estEntitéJuridique: boolean;
  estComparaison: boolean;
}>;

export const ContenuNombreDeSéjourMCO = ({ dateDeMiseÀJour, source, estEntitéJuridique = false, estComparaison }: ContenuDuNombreDeSéjourMCOProps) => {
  const { wording } = useDependencies();
  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        {estComparaison && <p> Total hospitalisation: complète + partielle</p>}
        <p>Permet d’observer l’évolution de l’activité de l’établissement et le développement des prises en charge ambulatoires.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Mensuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
          <br />
          Nombre de RSA (Résumé de Sortie Anonymisé) classés selon la nomenclature des activités de soins (ASO) utilisée dans le cadre de la délivrance des
          autorisations. Les séjours pour séances et en erreurs sont retirés.
          <br />
          <br />
          Hospitalisation complète (HC) : durée de séjour est égale ou supérieure à 1 journée (date de sortie différente de la date d’entrée).
          <br />
          <br />
          Hospitalisation de jour (HdJ)/ambulatoire (HP) : durée de séjour est inférieure à 1 journée (date de sortie identique à la date d’entrée).
        </p>
        {estEntitéJuridique && (
          <p>
            L’activité affichée au niveau de l’entité juridique (EJ) correspond à la somme de l’activité du ou des établissements géographiques rattachés à
            l’EJ.
          </p>
        )}
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
        </p>
        <ul>
          <li>Programme de médicalisation des systèmes d’information (PMSI) - Agence technique de l’information sur l’hospitalisation (ATIH)</li>
          <li>Médecine Chirurgie Obstétrique (MCO) - fichiers RSA (Résumé de Sortie Anonymisé)</li>
        </ul>
      </section>
      <br />
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Dans le cadre du PMSI, tout séjour dans un établissement de santé, public ou privé, fait l’objet d’un recueil systématique et minimal d’informations
          administratives et médicales qui sont utilisées principalement pour le financement des établissements de santé (tarification à l’activité) et pour
          l’organisation de l’offre de soins (planification).
        </p>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};
