import { ÉtablissementTerritorialMédicoSocial } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { CapacitéParActivité } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation'
import { Wording } from '../../../configuration/wording/Wording'
import { ActionneurDAccordéon } from '../../commun/Accordéon/ActionneurDAccordéon'
import { GraphiqueViewModel } from '../../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../../commun/StringFormater'
import styles from './BlocAutorisationEtCapacitéMédicoSocial.module.css'

export class ÉtablissementTerritorialMédicoSocialAutorisationsViewModel extends GraphiqueViewModel {
  constructor(
    private readonly établissementTerritorialAutorisations: ÉtablissementTerritorialMédicoSocial['autorisationsEtCapacités'],
    wording: Wording
  ) {
    super(wording, 0)
  }

  public get autorisations(): JSX.Element {
    const autorisationsDeLÉtablissement = this.établissementTerritorialAutorisations.autorisations

    return (
      <ul
        aria-label="disciplines"
        className={`${styles['liste-autorisations']}`}
      >
        {autorisationsDeLÉtablissement.disciplines.map((discipline) => (
          <li
            key={`discipline-${discipline.code}`}
          >
            <ActionneurDAccordéon
              for={`accordion-${discipline.code}`}
              titre={`${discipline.libellé} [${discipline.code}]`}
            />
            <ul
              className={`fr-collapse ${styles['liste-activites']}`}
              id={`accordion-${discipline.code}`}
            >
              {
                discipline.activités.map((activité) => (
                  <li
                    key={`activité-${activité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`accordion-${discipline.code}-${activité.code}`}
                      texteGras={false}
                      titre={`${activité.libellé} [${activité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${styles['liste-clienteles']}`}
                      id={`accordion-${discipline.code}-${activité.code}`}
                    >
                      {
                        activité.clientèles.map((clientèle) => {
                          const datesEtCapacités = clientèle.datesEtCapacités
                          return (
                            <li key={`clientèle-${clientèle.code}`}>
                              <ul
                                aria-label="dates-et-capacités"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${clientèle.libellé} [${clientèle.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_D_AUTORISATION} : ${datesEtCapacités.dateDAutorisation ? StringFormater.formateLaDate(datesEtCapacités.dateDAutorisation) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.MISE_À_JOUR_AUTORISATION} : ${datesEtCapacités.dateDeMiseÀJourDAutorisation ? StringFormater.formateLaDate(datesEtCapacités.dateDeMiseÀJourDAutorisation) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DERNIÈRE_INSTALLATION} : ${datesEtCapacités.dateDeDernièreInstallation ? StringFormater.formateLaDate(datesEtCapacités.dateDeDernièreInstallation) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.CAPACITÉ_AUTORISÉE} : ${datesEtCapacités.capacitéAutoriséeTotale ?? 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.CAPACITÉ_INSTALLÉE} : ${datesEtCapacités.capacitéInstalléeTotale ?? 'N/A'}`}
                                </li>
                              </ul>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </li>
                ))
              }
            </ul>
          </li>
        ))}
      </ul>
    )
  }

  public get lesAutorisationsSontEllesRenseignées(): boolean {
    return this.établissementTerritorialAutorisations.autorisations.disciplines.length !== 0
  }

  public get dateDeMiseÀJourDesAutorisations(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialAutorisations.autorisations.dateMiseÀJourSource)
  }

  public get capacitéParActivités(): JSX.Element {
    const [activités, capacités] = this.construisLesCapacitésParActivités()
    const couleursDuGraphe = Array(capacités.length).fill(this.couleurDuFondHistogrammeSecondaire).fill(this.couleurDuFondHistogrammePrimaire, 0, 1)
    const couleursDesLibellés = Array(capacités.length).fill('black')
    const taillesDePoliceDesLibellés = Array(capacités.length).fill('normal').fill('bold', 0, 1)
    const libellés = this.construisLesLibellés(activités, couleursDesLibellés, taillesDePoliceDesLibellés)

    return this.afficheUnHistogrammeHorizontal(
      couleursDuGraphe,
      capacités,
      libellés,
      this.calculeLeRatioDesHistogrammesHorizontaux(activités.length),
      this.wording.ACTIVITÉ,
      this.wording.CAPACITÉ_INSTALLÉE,
      [],
      capacités.length
    )
  }

  public get lesCapacitésSontEllesRenseignées(): boolean {
    return this.établissementTerritorialAutorisations.capacités.capacitéParActivité.length !== 0
  }

  public get dateDeMiseÀJourDesCapacitésParActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialAutorisations.capacités.dateMiseÀJourSource)
  }

  private construisLesCapacitésParActivités(): [string[], number[]] {
    const activités: string[] = []
    const capacités: number[] = []
    let capacitéTotale = 0

    this.établissementTerritorialAutorisations.capacités.capacitéParActivité.forEach((activité: CapacitéParActivité) => {
      activités.push(activité.libellé)
      capacités.push(activité.capacité)
      capacitéTotale += activité.capacité
    })

    activités.splice(0, 0, this.wording.NOMBRE_TOTAL_DE_PLACE)
    capacités.splice(0, 0, capacitéTotale)
    return [activités, capacités]
  }

}
