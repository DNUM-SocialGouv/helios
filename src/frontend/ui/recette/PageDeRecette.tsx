import Image from 'next/image'
import { ReactElement } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'
import { ListItem } from '../commun/ListItem/ListItem'
import LogoÉtablissementTerritorialMédicoSocial from '../entité-juridique/liste-des-établissements/logo-établissement-territorial-médico-social-noir.svg'
import LogoÉtablissementTerritorialSanitaire from '../entité-juridique/liste-des-établissements/logo-établissement-territorial-sanitaire-noir.svg'
import LogoEntitéJuridiqueNoir from '../home/logo-entité-juridique-noir.svg'
import styles from './PageDeRecette.module.css'

export const PageDeRecette = () => {
  const { paths, wording } = useDependencies()

  const entitésJuridiques: {identifiant: ReactElement, numéroFiness: string}[] = [
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {' - 750 050 759 - CANSSM FILIERIS (avec que des ET sanitaires)'}
      </>,
      numéroFiness: '750050759',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        - 750 060 758 - SARL DOMITYS NORD OUEST (avec que des ET médico-sociaux)
      </>,
      numéroFiness: '750060758',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {'- 500 020 839 - GCSMS &quot;PRESQU’ÎLE&quot; (sans ET)'}
      </>,
      numéroFiness: '500020839',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        - 750 721 334 - CROIX ROUGE FRANCAISE (avec beaucoup d’ET)
      </>,
      numéroFiness: '750721334',
    },
    {
      identifiant: <>
        <abbr title={wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        - 210 012 142 - CTRE HOSPITALIER DE LA HAUTE COTE D’OR (avec un nom d’établissement très long)
      </>,
      numéroFiness: '210012142',
    },
  ]
  const établissementsTerritoriauxMédicoSociaux: {identifiant: ReactElement, numéroFiness: string}[] = [
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 690 024 898 - EHPAD SAINT-FRANCOIS D’ASSISE (avec toutes les données d’activités)
      </>,
      numéroFiness: '690024898',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 690 015 458 - ACCUEIL DE JOUR LES PETITS BONHEURS (certains indicateurs ne sont pas disponibles dans les données activité)
      </>,
      numéroFiness: '690015458',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 370 103 137 - ESAT ANAIS DE METTRAY (avec une année manquante dans les données activité)
      </>,
      numéroFiness: '370103137',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 130 008 329 - EHPAD RESIDENCE LES LAVANDINS (avec une année vide dans les données activité)
      </>,
      numéroFiness: '130008329',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 010 007 425 - SSIAD EHPAD SAINT-TRIVIER-DE-COURTES (avec toutes les données activités disponibles mais vides)
      </>,
      numéroFiness: '010007425',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 660 011 859 - SAAD DOMITYS SUD EST LES TOURS D’OR (avec aucune activité)
      </>,
      numéroFiness: '660011859',
    },
  ]
  const établissementsTerritoriauxSanitaires: {identifiant: ReactElement, numéroFiness: string}[] = [
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 120 004 668 - CH EMILE BOREL ST AFFRIQUE (avec toutes les données d’activités)
      </>,
      numéroFiness: '120004668',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 780 150 017 - CTR DE SOINS ET READAPTATION CESSRIN (sans nombres de passages urgences)
      </>,
      numéroFiness: '780150017',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 450 000 021 - HÔPITAL MADELEINE (sans données MCO)
      </>,
      numéroFiness: '450000021',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 010 008 852 - CRF L’ORCET SITE DU CH DE FLEYRIAT (avec toutes les données activités disponibles mais vides)
      </>,
      numéroFiness: '010008852',
    },
    {
      identifiant: <>
        <abbr title={wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        - 830 208 120 - CDS MEDICAL FILIERIS BRIGNOLES (avec aucune activité)
      </>,
      numéroFiness: '830208120',
    },
  ]

  return (
    <>
      <section
        aria-label={wording.TITRE_LISTE_DES_ENTITÉS_JURIDIQUES}
        className="fr-mt-5w"
      >
        <h1 className="fr-h3">
          {wording.ENTITÉS_JURIDIQUES}
        </h1>
        <ul className={styles['liste-entités-juridiques'] + ' fr-raw-list fr-text--bold fr-raw-link'}>
          {
            entitésJuridiques.map((entitéJuridique) =>
              <ListItem
                key={entitéJuridique.numéroFiness}
                label={entitéJuridique.identifiant}
                lien={`${paths.ENTITÉ_JURIDIQUE}/${entitéJuridique.numéroFiness}`}
                logo={<>
                  <Image
                    alt=""
                    height="22"
                    src={LogoEntitéJuridiqueNoir}
                    width="22"
                  />
                </>}
              />)
          }
        </ul>
      </section>
      <section
        aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX}
        className="fr-mt-5w"
      >
        <h1 className="fr-h3">
          {wording.ÉTABLISSEMENT_TERRITORIAUX + ' Médico-Sociaux'}
        </h1>
        <ul className={styles['liste-entités-juridiques'] + ' fr-raw-list fr-text--bold fr-raw-link'}>
          {
            établissementsTerritoriauxMédicoSociaux.map((établissementTerritorial) =>
              <ListItem
                key={établissementTerritorial.numéroFiness}
                label={établissementTerritorial.identifiant}
                lien= {`${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/${établissementTerritorial.numéroFiness}`}
                logo={<>
                  <Image
                    alt=""
                    height="22"
                    src={LogoÉtablissementTerritorialMédicoSocial}
                    width="22"
                  />
                </>}
              />)
          }
        </ul>
      </section>
      <section
        aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX}
        className="fr-mt-5w"
      >
        <h1 className="fr-h3">
          {wording.ÉTABLISSEMENT_TERRITORIAUX + ' Sanitaires'}
        </h1>
        <ul className={styles['liste-entités-juridiques'] + ' fr-raw-list fr-text--bold fr-raw-link'}>
          {
            établissementsTerritoriauxSanitaires.map((établissementTerritorial) =>
              <ListItem
                key={établissementTerritorial.numéroFiness}
                label={établissementTerritorial.identifiant}
                lien= {`${paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE}/${établissementTerritorial.numéroFiness}`}
                logo={<>
                  <Image
                    alt=""
                    height="22"
                    src={LogoÉtablissementTerritorialSanitaire}
                    width="22"
                  />
                </>}
              />)
          }
        </ul>
      </section>
    </>
  )
}
