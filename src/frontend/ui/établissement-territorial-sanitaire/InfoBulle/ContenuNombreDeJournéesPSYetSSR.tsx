import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDuNombreDeJournéesPSYetSSRProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuNombreDeJournéesPSYetSSR = ({ dateDeMiseÀJour, source }: ContenuDuNombreDeJournéesPSYetSSRProps) => {
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
          <b>Nombre de journées Soins de Suite et de Réadaptation (SSR) :</b>
          {' '}
          nombre de jours des séjours. Somme (nombre de jours de semaine + nombre de jours de week-end).
          <br />
          <b>Nombre de journées Psychiatrie (PSY) :</b>
          {' '}
          le nombre de journées correspond à la somme du nombre de journées de présence et du nombre de demi journées de présence, ce dernier multiplié par 0,5.
          Le nombre de demi-journées n’est comptabilisé que pour les prises en charge à temps partiel (formes d’activité 20, 21, 23).
          Seules des journées entières sont recueillies pour les prises en charge à temps complet (formes d’activité 01, 02, 03, 04, 05, 06, 07).
          <br />
          <br />
          <b>Type Hospitalisation :</b>
          <br />
          <b>SSR :</b>
          {' '}
          Le type d’hospitalisation est déduit dans DIAMANT sur la base du type d’hospitalisation de l’unité médicale, disponible dans le RHA,
          qui prend les valeurs :
        </p>
        <ol>
          <li>Hospitalisation complète ou de semaine en soins de suite médicalisés =&gt; Hospitalisation complète ou de semaine (HC)</li>
          <li>Hospitalisation de nuit en soins de suite médicalisés =&gt; Hospitalisation de jour ou de nuit (HJ)</li>
          <li>Séances (traitements et cures ambulatoires) en soins de suite médicalisés =&gt; Venues ou séances (Séances)</li>
        </ol>
        <p>
          <b>PSY :</b>
          {' '}
          Le type d’hospitalisation est déduit dans DIAMANT sur la base des formes d’activité :
        </p>
        <ul>
          <li>
            Prises en charge à temps complet :
            <ul>
              <li>Code 01 Hospitalisation à temps plein</li>
              <li>Code 02 Séjour thérapeutique</li>
              <li>Code 03 Hospitalisation à domicile</li>
              <li>Code 04 Placement familial thérapeutique29</li>
              <li>Code 05 Appartement thérapeutique</li>
              <li>Code 06 Centre de postcure psychiatrique</li>
              <li>Code 07 Centre de crise (incluant centre d’accueil permanent et centre d’accueil et de crise)</li>
            </ul>
          </li>
          <li>
            Prises en charge à temps partiel :
            <ul>
              <li>Code 20 Hospitalisation à temps partiel de jour</li>
              <li>Code 21 Hospitalisation à temps partiel de nuit</li>
              <li>Code 23 Prise en charge en atelier thérapeutique</li>
            </ul>
          </li>
        </ul>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
        </p>
        <ul>
          <li>Programme de médicalisation des systèmes d’information (PMSI)  - Agence technique de l’information sur l’hospitalisation (ATIH)</li>
          <li>Soins de Suite et de Réadaptation (SSR) - fichiers RHA (Résumés Hebdomadaires de sortie Anonymes)</li>
          <li>Psychiatrie - fichiers RPSA (Résumé Par Séquence Anonymisé) et R3A (Résumé d’Activité Ambulatoire Anonyme)</li>
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
