import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDuNombreDeSéjourMCOProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuNombreDeSéjourMCO = ({ dateDeMiseÀJour, source }: ContenuDuNombreDeSéjourMCOProps) => {
  const { wording } = useDependencies()
  return (
    <>
      <p>
        Mise à jour :
        {' '}
        {dateDeMiseÀJour}
        {' '}
        - Source :
        {' '}
        {source}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Permet d’observer l’évolution de l’activité de l’établissement et le développement des prises en charge ambulatoires.
        </p>
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
          <b>Nombre de séjours Médecine Chirurgie Obstétrique (MCO) :</b>
          {' '}
          comptage des identifiants uniques des séjours.
          Les séjours pour séances et en erreurs sont retirés.
          <br />
          <br />
          <b>Nombre de journées Soins de Suite et de Réadaptation (SSR) :</b>
          {' '}
          nombre de jours des séjours. Somme (nombre de jours de semaine + nombre de jours de week-end).
          <br />
          <br />
          <b>Nombre de journées Psychiatrie (PSY) :</b>
          {' '}
          le nombre de journées correspond à la somme du nombre de journées de présence et du nombre de demi journées de
          présence, ce dernier multiplié par 0,5. Le nombre de demi-journées n’est comptabilisé que pour les prises en
          charge à temps partiel (formes d’activité 20, 21, 23). Seules des journées entières sont recueillies pour les
          prises en charge à temps complet (formes d’activité 01, 02, 03, 04, 05, 06, 07).
          <br />
          <br />
          <b>Nombre de journées Hospitalisation A Domicile (HAD) :</b>
          {' '}
          nombre de journées valorisées par le Groupe Homogène de Tarif (GHT).
          <br />
          <br />
          <b>Type Hospitalisation :</b>
          <br />
          MCO - information produite dans DIAMANT à partir de la durée du séjour :
        </p>
        <ul>
          <li>
            durée séjour =  0 hors CMD28 (Code Majeur de Diagnostic des Séances) =&gt; « Ambulatoire » ou HTP (Hospitalisation à Temps Partiel)
          </li>
          <li>
            durée séjour &gt; 0 hors CMD28 =&gt; « HC » (Hospitalisation Complète)
          </li>
          <li>
            CMD 28 =&gt; « Séance »
          </li>
        </ul>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
        </p>
        <ul>
          <li>Programme de médicalisation des systèmes d’information (PMSI)  - Agence technique de l’information sur l’hospitalisation (ATIH)</li>
          <li>Médecine Chirurgie Obstétrique (MCO) - fichiers RSA (Résumé de Sortie Anonymisé)</li>
          <li>Soins de Suite et de Réadaptation (SSR) - fichiers RHA (Résumés Hebdomadaires de sortie Anonymes)</li>
          <li>Psychiatrie - fichiers RPSA (Résumé Par Séquence Anonymisé) et R3A (Résumé d’Activité Ambulatoire Anonyme)</li>
          <li>Hospitalisation A Domicile (HAD) - fichiers RAPSS (Résumés Anonyme Par Sous-Séquence)</li>
          <li>Urgences - fichiers RPU (Résumé de passage aux urgences)</li>
        </ul>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Dans le cadre du PMSI, tout séjour dans un établissement de santé, public ou privé, fait l’objet d’un recueil systématique
          et minimal d’informations administratives et médicales qui sont utilisées principalement pour le financement des établissements
          de santé (tarification à l’activité) et pour l’organisation de l’offre de soins (planification).
        </p>
      </section>
    </>
  )
}
