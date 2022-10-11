import { ÉtablissementTerritorialSanitaire } from '../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Wording } from '../../../configuration/wording/Wording'
import { ActionneurDAccordéon } from '../../commun/Accordéon/ActionneurDAccordéon'
import { GraphiqueViewModel } from '../../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../../commun/StringFormater'
import stylesBlocAutorisationsEtCapacités from './BlocAutorisationEtCapacitéSanitaire.module.css'
import '@gouvfr/dsfr/dist/component/tag/tag.min.css'

export class ÉtablissementTerritorialSanitaireAutorisationsViewModel extends GraphiqueViewModel {
  readonly ratioHistogrammeCapacitéParActivités = 5

  constructor(
    private readonly établissementTerritorialSanitaireAutorisations: ÉtablissementTerritorialSanitaire['autorisationsEtCapacités'],
    wording: Wording
  ) {
    super(wording)
  }

  public get lesCapacitésParActivitésSontEllesRenseignées(): boolean {
    const capacités = this.établissementTerritorialSanitaireAutorisations.capacités

    return (capacités !== null) && (
      capacités.nombreDeLitsEnMédecine !== null ||
      capacités.nombreDeLitsEnObstétrique !== null ||
      capacités.nombreDeLitsEnSsr !== null ||
      capacités.nombreDePlacesEnChirurgie !== null ||
      capacités.nombreDePlacesEnMédecine !== null ||
      capacités.nombreDePlacesEnObstétrique !== null ||
      capacités.nombreDePlacesEnSsr !== null ||
      capacités.nombreDeLitsEnUsld !== null ||
      capacités.nombreDeLitsOuPlacesEnPsyHospitalisationComplète !== null ||
    capacités.nombreDePlacesEnPsyHospitalisationPartielle !== null)
  }

  public get dateDeMiseÀJourDeLaCapacitéInstalléeParActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.capacités?.dateMiseÀJourSource as string)
  }

  public get capacitéParActivités(): JSX.Element {
    const lits = [
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDeLitsEnChirurgie as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDeLitsEnMédecine as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDeLitsEnObstétrique as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDeLitsOuPlacesEnPsyHospitalisationComplète as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDeLitsEnSsr as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDeLitsEnUsld as number,
    ]
    const places = [
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDePlacesEnChirurgie as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDePlacesEnMédecine as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDePlacesEnObstétrique as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDePlacesEnPsyHospitalisationPartielle as number,
      this.établissementTerritorialSanitaireAutorisations.capacités?.nombreDePlacesEnSsr as number,
      0,
    ]
    const chartColors = [this.couleurDuFondHistogrammeSecondaire]
    const libellés = [
      this.wording.CHIRURGIE,
      this.wording.MÉDECINE,
      this.wording.OBSTÉTRIQUE,
      this.wording.PSYCHIATRIE,
      this.wording.SSR,
      this.wording.USLD,
    ]
    const identifiants = [this.wording.LITS, this.wording.PLACES]

    return this.afficheDeuxHistogrammesHorizontaux(
      chartColors,
      lits,
      places,
      libellés,
      this.ratioHistogrammeCapacitéParActivités,
      this.wording.ACTIVITÉS,
      identifiants
    )
  }

  public get autorisations(): JSX.Element {
    const autorisationsDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.autorisations

    return (
      <ul
        aria-label="activités"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {autorisationsDeLÉtablissement.activités.map((activité) => (
          <li
            key={`activité-${activité.code}`}
          >
            <ActionneurDAccordéon
              for={`autorisations-accordion-${activité.code}`}
              titre={`${activité.libellé} [${activité.code}]`}
            />
            <ul
              className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`autorisations-accordion-${activité.code}`}
            >
              {
                activité.modalités.map((modalité) => (
                  <li
                    key={`modalité-${modalité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`autorisations-accordion-${activité.code}-${modalité.code}`}
                      texteGras={false}
                      titre={`${modalité.libellé} [${modalité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-formes']}`}
                      id={`autorisations-accordion-${activité.code}-${modalité.code}`}
                    >
                      {
                        modalité.formes.map((forme) => {
                          const autorisationSanitaire = forme.autorisationSanitaire
                          return (
                            <li key={`forme-${forme.code}`}>
                              <ul
                                aria-label="autorisations"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${forme.libellé} [${forme.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.NUMÉRO_ARHGOS} : ${autorisationSanitaire.numéroArhgos ? autorisationSanitaire.numéroArhgos : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autorisationSanitaire.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autorisationSanitaire.dateDeMiseEnOeuvre) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_FIN} : ${autorisationSanitaire.dateDeFin ? StringFormater.formateLaDate(autorisationSanitaire.dateDeFin) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_D_AUTORISATION} : ${autorisationSanitaire.dateDAutorisation ? StringFormater.formateLaDate(autorisationSanitaire.dateDAutorisation) : 'N/A'}`}
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
    return this.établissementTerritorialSanitaireAutorisations.autorisations.activités.length !== 0
  }

  public get dateDeMiseÀJourDesAutorisations(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.autorisations.dateMiseÀJourSource)
  }

  public get autresActivités(): JSX.Element {
    const autresActivitésDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.autresActivités

    return (
      <ul
        aria-label="activités"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {autresActivitésDeLÉtablissement.activités.map((activité) => (
          <li
            key={`activité-${activité.code}`}
          >
            <ActionneurDAccordéon
              for={`autresActivités-accordion-${activité.code}`}
              titre={`${activité.libellé} [${activité.code}]`}
            />
            <ul
              className={` fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`autresActivités-accordion-${activité.code}`}
            >
              {
                activité.modalités.map((modalité) => (
                  <li
                    key={`modalité-${modalité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`autresActivités-accordion-${activité.code}-${modalité.code}`}
                      texteGras={false}
                      titre={`${modalité.libellé} [${modalité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-formes']}`}
                      id={`autresActivités-accordion-${activité.code}-${modalité.code}`}
                    >
                      {
                        modalité.formes.map((forme) => {
                          const autreActivitéSanitaire = forme.autreActivitéSanitaire
                          return (
                            <li key={`forme-${forme.code}`}>
                              <ul
                                aria-label="autre-activité"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${forme.libellé} [${forme.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_D_AUTORISATION} : ${autreActivitéSanitaire.dateDAutorisation ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDAutorisation) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autreActivitéSanitaire.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDeMiseEnOeuvre) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.DATE_DE_FIN} : ${autreActivitéSanitaire.dateDeFin ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDeFin) : 'N/A'}`}
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

  public get dateDeMiseÀJourDesAutresActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.autresActivités.dateMiseÀJourSource)
  }

  public get lesAutresActivitésSontEllesRenseignées(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.autresActivités.activités.length !== 0
  }

  public get reconnaissancesContractuelles(): JSX.Element {
    const reconnaissancesContractuellesDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles

    return (
      <ul
        aria-label="activités"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {reconnaissancesContractuellesDeLÉtablissement.activités.map((activité) => (
          <li
            key={`activité-${activité.code}`}
          >
            <ActionneurDAccordéon
              for={`reconnaissances-contractuelles-accordion-${activité.code}`}
              titre={`${activité.libellé} [${activité.code}]`}
            />
            <ul
              className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`reconnaissances-contractuelles-accordion-${activité.code}`}
            >
              {
                activité.modalités.map((modalité) => (
                  <li
                    key={`modalité-${modalité.code}`}
                  >
                    <ActionneurDAccordéon
                      for={`reconnaissances-contractuelles-accordion-${activité.code}-${modalité.code}`}
                      texteGras={false}
                      titre={`${modalité.libellé} [${modalité.code}]`}
                    />
                    <ul
                      className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-formes']}`}
                      id={`reconnaissances-contractuelles-accordion-${activité.code}-${modalité.code}`}
                    >
                      {
                        modalité.formes.map((forme) => {
                          const reconnaissancesContractuellesSanitaire = forme.reconnaissanceContractuelleSanitaire
                          return (
                            <li key={`forme-${forme.code}`}>
                              <ul
                                aria-label="reconnaissance-contractuelle"
                                className="fr-tags-group"
                              >
                                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                                  {`${forme.libellé} [${forme.code}]`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.NUMÉRO_ARHGOS} : ${reconnaissancesContractuellesSanitaire.numéroArhgos ? reconnaissancesContractuellesSanitaire.numéroArhgos : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.NUMÉRO_CPOM}
                                  {`: ${reconnaissancesContractuellesSanitaire.numéroCpom ? reconnaissancesContractuellesSanitaire.numéroCpom : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.DATE_D_EFFET_ASR}
                                  {`: ${reconnaissancesContractuellesSanitaire.dateDEffetAsr ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDEffetAsr) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.DATE_D_EFFET_CPOM}
                                  {`: ${reconnaissancesContractuellesSanitaire.dateDEffetCpom ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDEffetCpom) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {this.wording.DATE_DE_FIN_CPOM}
                                  {`: ${reconnaissancesContractuellesSanitaire.dateDeFinCpom ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDeFinCpom) : 'N/A'}`}
                                </li>
                                <li className="fr-tag">
                                  {`${this.wording.CAPACITÉ_AUTORISÉE} : ${reconnaissancesContractuellesSanitaire.capacitéAutorisée ? reconnaissancesContractuellesSanitaire.capacitéAutorisée : 'N/A'}`}
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

  public get dateDeMiseÀJourDesReconnaissancesContractuelles(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles.dateMiseÀJourSource)
  }

  public get lesReconnaissancesContractuellesSontEllesRenseignées(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles.activités.length !== 0
  }

  public get équipementsMatérielsLourds(): JSX.Element {
    const équipementsMatérielsLourdsDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds

    return (
      <ul
        aria-label="équipements"
        className={`${stylesBlocAutorisationsEtCapacités['liste-activités']}`}
      >
        {équipementsMatérielsLourdsDeLÉtablissement.équipements.map((équipements) => (
          <li
            key={`équipement-${équipements.code}`}
          >
            <ActionneurDAccordéon
              for={`équipements-matériels-lourds-accordion-${équipements.code}`}
              titre={`${équipements.libellé} [${équipements.code}]`}
            />
            <ul
              className={`fr-collapse ${stylesBlocAutorisationsEtCapacités['liste-modalités']}`}
              id={`équipements-matériels-lourds-accordion-${équipements.code}`}
            >
              {
                équipements.autorisations.map((autorisationÉquipementMatérielLourd) => {
                  return (
                    <li key={`forme-${autorisationÉquipementMatérielLourd.numéroArhgos}`}>
                      <ul
                        aria-label="équipement-matériel-lourd"
                        className="fr-tags-group"
                      >
                        <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left">
                          {`${this.wording.NUMÉRO_ARHGOS} : ${autorisationÉquipementMatérielLourd.numéroArhgos ? autorisationÉquipementMatérielLourd.numéroArhgos : 'N/A'}`}
                        </li>
                        <li className="fr-tag">
                          {`${this.wording.DATE_D_AUTORISATION} : ${autorisationÉquipementMatérielLourd.dateDAutorisation ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDAutorisation) : 'N/A'}`}
                        </li>
                        <li className="fr-tag">
                          {`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre) : 'N/A'}`}
                        </li>
                        <li className="fr-tag">
                          {`${this.wording.DATE_DE_FIN} : ${autorisationÉquipementMatérielLourd.dateDeFin ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDeFin) : 'N/A'}`}
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
    )
  }

  public get dateDeMiseÀJourDesÉquipementsMatérielsLourds(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds.dateMiseÀJourSource)
  }

  public get lesÉquipementsMatérielsLourdsSontIlsRenseignés(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds.équipements.length !== 0
  }
}
