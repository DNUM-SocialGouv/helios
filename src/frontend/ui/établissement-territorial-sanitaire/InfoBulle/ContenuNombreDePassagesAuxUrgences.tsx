import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuNombreDePassagesAuxUrgencesProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuNombreDePassagesAuxUrgences =
  ({ dateDeMiseÀJour, source }: ContenuNombreDePassagesAuxUrgencesProps) => {
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
            Un résumé de passages aux urgences (RPU) est un recueil standardisé de données médico-administratives pour chaque passage aux urgences.
            La transmission des RPU par les établissements de santé publics ou privés ayant une activité de médecine d’urgence a été rendue obligatoire
            par arrêté du 24 juillet 2013 dans un objectif de veille et de sécurité sanitaire mais également d’amélioration des connaissances de
            l’activité des services d’urgences.
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
          </p>
          <p>
            Nombre de séjours Médecine Chirurgie Obstétrique (MCO) : comptage des identifiants uniques des séjours.
            Les séjours pour séances et en erreurs sont retirés.
          </p>
          <p>
            Nombre de journées Soins de Suite et de Réadaptation (SSR) : nombre de jours des séjours.
            Somme (nombre de jours de semaine + nombre de jours de week-end)
          </p>
          <p>
            Nombre de journées Psychiatrie (PSY) : le nombre de journées correspond à la somme du nombre de journées de présence et
            du nombre de demi journées de présence, ce dernier multiplié par 0,5. Le nombre de demi-journées n’est comptabilisé que
            pour les prises en charge à temps partiel (formes d’activité 20, 21, 23). Seules des journées entières sont recueillies
            pour les prises en charge à temps complet (formes d’activité 01, 02, 03, 04, 05, 06, 07). A FAIRE VALIDER DIAMANT
          </p>
          <p>
            Nombre de journées Hospitalisation A Domicile (HAD) : nombre de journées valorisées par le Groupe Homogène de Tarif (GHT)
          </p>
          <p>
            Type Hospitalisation :
            <br />
            MCO - information produite dans DIAMANT à partir de la durée du séjour :
            <br />
            o durée séjour =  0 hors CMD28 (Code Majeur de Diagnostic des Séances) =&#62; « Ambulatoire » ou HTP (Hospitalisation à Temps Partiel)
            <br />
            o durée séjour &#62; 0 hors CMD28 =&#62; « HC » (Hospitalisation Complète)
            <br />
            o CMD 28 =&#62; « Séance »
          </p>
          <p>
            SSR - Le type d’hospitalisation est déduit dans DIAMANT sur la base du type d’hospitalisation de l’unité médicale,
            disponible dans le RHA, qui prend les valeurs :
            <br />
            o 1 : Hospitalisation complète ou de semaine en soins de suite médicalisés =&#62; Hospitalisation complète ou de semaine (HC)
            <br />
            o 2 : Hospitalisation de jour en soins de suite médicalisés =&#62; Hospitalisation de jour ou de nuit (HJ)
            <br />
            o 3 : Hospitalisation de nuit en soins de suite médicalisés =&#62; Hospitalisation de jour ou de nuit (HJ)
            <br />
            o 4 : Séances (traitements et cures ambulatoires) en soins de suite médicalisés =&#62; Venues ou séances (Séances)
          </p>
          <p>
            PSY : Le type d’hospitalisation est déduit dans DIAMANT sur la base des formes d’activité :
            <br />
            - Prises en charge à temps complet :
            <br />
            Code 01 Hospitalisation à temps plein
            <br />
            Code 02 Séjour thérapeutique
            <br />
            Code 03 Hospitalisation à domicile
            <br />
            Code 04 Placement familial thérapeutique29
            <br />
            Code 05 Appartement thérapeutique
            <br />
            Code 06 Centre de postcure psychiatrique
            <br />
            Code 07 Centre de crise (incluant centre d’accueil permanent et centre d’accueil et de crise)
          </p>
          <p>
            - Prises en charge à temps partiel :
            <br />
            Code 20 Hospitalisation à temps partiel de jour
            <br />
            Code 21 Hospitalisation à temps partiel de nuit
            <br />
            Code 23 Prise en charge en atelier thérapeutique
          </p>
          <p>
            Classification selon la nomenclature des activités de soins (ASO) utilisée dans le cadre de la délivrance des dites autorisations
          </p>
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
            Dans le cadre du PMSI, tout séjour dans un établissement de santé, public ou privé, fait l’objet d’un recueil systématique et
            minimal d’informations administratives et médicales qui sont utilisées principalement pour le financement des établissements
            de santé (tarification à l’activité) et pour l’organisation de l’offre de soins (planification).
          </p>
        </section>
      </>
    )
  }
