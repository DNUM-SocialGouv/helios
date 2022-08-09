import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../commun/Sources/Sources'
import styles from './BlocActivitéSanitaire.module.css'
import { ContenuNombreDeJournéesPSYetSSR } from './InfoBulle/ContenuNombreDeJournéesPSYetSSR'
import { ContenuNombreDePassagesAuxUrgences } from './InfoBulle/ContenuNombreDePassagesAuxUrgences'
import { ContenuNombreDeSéjourMCO } from './InfoBulle/ContenuNombreDeSéjourMCO'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type BlocActivitéSanitaireProps = {
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel
}

export const BlocActivitéSanitaire = ({ établissementTerritorialSanitaireViewModel }: BlocActivitéSanitaireProps) => {
  const { wording } = useDependencies()

  if (
    !établissementTerritorialSanitaireViewModel.activitéEstElleRenseignée ||
    (
      !établissementTerritorialSanitaireViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
      !établissementTerritorialSanitaireViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
      !établissementTerritorialSanitaireViewModel.nombreDePassagesAuxUrgencesEstIlRenseigné
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
        {établissementTerritorialSanitaireViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuNombreDeSéjourMCO
              dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
              source={Sources(wording.DIAMANT, wording.PMSI)}
            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
            identifiant="activite-0"
            nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
            source={Sources(wording.DIAMANT, wording.PMSI)}
          >
            { établissementTerritorialSanitaireViewModel.nombreDeSéjoursMédecineChirurgieObstétrique }
          </IndicateurGraphique>
        }
        {établissementTerritorialSanitaireViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuNombreDeJournéesPSYetSSR
              dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
              source={Sources(wording.DIAMANT, wording.PMSI)}

            />}
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr}
            identifiant="activite-1"
            nomDeLIndicateur={wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR}
            source={Sources(wording.DIAMANT, wording.PMSI)}
          >
            { établissementTerritorialSanitaireViewModel.nombreDeJournéesPsyEtSsr }
          </IndicateurGraphique>
        }
        <IndicateurGraphique
          contenuInfoBulle={<ContenuNombreDePassagesAuxUrgences
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNombreDePassagesAuxUrgences}
            source={Sources(wording.DIAMANT, wording.PMSI)}
          />}
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJourDuNombreDePassagesAuxUrgences}
          identifiant="activite-2"
          nomDeLIndicateur={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
          source={Sources(wording.DIAMANT, wording.PMSI)}
        >
          {établissementTerritorialSanitaireViewModel.nombreDePassagesAuxUrgences}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
