import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../../commun/Sources/Sources'
import { ContenuNombreDeJournéesPSYetSSR } from '../InfoBulle/ContenuNombreDeJournéesPSYetSSR'
import { ContenuNombreDePassagesAuxUrgences } from '../InfoBulle/ContenuNombreDePassagesAuxUrgences'
import { ContenuNombreDeSéjourMCO } from '../InfoBulle/ContenuNombreDeSéjourMCO'
import styles from './BlocActivitéSanitaire.module.css'
import { ÉtablissementTerritorialSanitaireActivitéViewModel } from './ÉtablissementTerritorialSanitaireActivitéViewModel'

type BlocActivitéSanitaireProps = {
  établissementTerritorialSanitaireActivitéViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel
}

export const BlocActivitéSanitaire = ({ établissementTerritorialSanitaireActivitéViewModel }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies()

  if (
    !établissementTerritorialSanitaireActivitéViewModel.activitéEstElleRenseignée ||
    (
      !établissementTerritorialSanitaireActivitéViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
      !établissementTerritorialSanitaireActivitéViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
      !établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgencesEstIlRenseigné
    )
  ) {
    return (
      <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
        {wording.INDICATEURS_VIDES}
      </Bloc>
    )
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={styles['liste-indicateurs']}>
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuNombreDeSéjourMCO
              dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
              source={Sources(wording.DIAMANT, wording.PMSI)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
            identifiant="activite-0"
            nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
            source={Sources(wording.DIAMANT, wording.PMSI)}
          >
            { établissementTerritorialSanitaireActivitéViewModel.nombreDeSéjoursMédecineChirurgieObstétrique }
          </IndicateurGraphique>
        }
        {établissementTerritorialSanitaireActivitéViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuNombreDeJournéesPSYetSSR
              dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
              source={Sources(wording.DIAMANT, wording.PMSI)}

            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
            identifiant="activite-1"
            nomDeLIndicateur={wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR}
            source={Sources(wording.DIAMANT, wording.PMSI)}
          >
            { établissementTerritorialSanitaireActivitéViewModel.nombreDeJournéesPsyEtSsr }
          </IndicateurGraphique>
        }
        <IndicateurGraphique
          contenuInfoBulle={<ContenuNombreDePassagesAuxUrgences
            dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDePassagesAuxUrgences}
            source={Sources(wording.DIAMANT, wording.RPU)}
          />}
          dateDeMiseÀJour={établissementTerritorialSanitaireActivitéViewModel.dateDeMiseÀJourDuNombreDePassagesAuxUrgences}
          identifiant="activite-2"
          nomDeLIndicateur={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
          source={Sources(wording.DIAMANT, wording.RPU)}
        >
          {établissementTerritorialSanitaireActivitéViewModel.nombreDePassagesAuxUrgences}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
