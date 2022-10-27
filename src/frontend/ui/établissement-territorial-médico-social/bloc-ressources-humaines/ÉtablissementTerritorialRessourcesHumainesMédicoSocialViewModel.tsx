import { ChangeEvent, ReactElement } from 'react'

import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines'
import { Wording } from '../../../configuration/wording/Wording'
import { CouleurHistogramme, GraphiqueViewModel, LibelléDeDonnéeGraphe } from '../../commun/Graphique/GraphiqueViewModel'
import { MiseEnExergue } from '../../commun/MiseEnExergue/MiseEnExergue'
import { Select } from '../../commun/Select/Select'
import { StringFormater } from '../../commun/StringFormater'
import { TableIndicateur } from '../../commun/TableIndicateur/TableIndicateur'

export class ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly RATIO_HISTOGRAMME_HORIZONTAL = 2
  private readonly SEUIL_DU_TAUX_DE_ROTATION_DU_PERSONNEL_ATYPIQUE: number = 50
  private readonly IDENTIFIANT_DE_LA_LÉGENDE_DES_TAUX_D_ABSENTÉISMES = 'légende-graphique-médico-social-taux-d-absentéisme'
  private readonly BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_PAR_MOTIF = 20
  private readonly BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_HORS_FORMATION = 40

  private readonly couleursDuDoughnutDesTauxDAbsentéismes: Record<string, { couleurDeLArc: string; couleurDuLibellé: string }>
  private readonly annéesAvecDesTauxDAbsentéismes: number[]

  constructor(private readonly ressourcesHumainesMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines[], wording: Wording) {
    super(wording)
    this.couleursDuDoughnutDesTauxDAbsentéismes = {
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[0], couleurDuLibellé: '#000' },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[1], couleurDuLibellé: '#000' },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[2], couleurDuLibellé: '#FFF' },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[3], couleurDuLibellé: '#FFF' },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[4], couleurDuLibellé: '#FFF' },
      [this.wording.TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX]: { couleurDeLArc: this.couleurDesArcsDuDonut.opaque[5], couleurDuLibellé: '#FFF' },
    }
    this.annéesAvecDesTauxDAbsentéismes = this.annéesRangéesParAntéChronologie()
  }

  public get annéeInitiale() {
    return this.annéesAvecDesTauxDAbsentéismes[0]
  }

  public listeDéroulanteDesAnnéesDesTauxDAbsentéismes(setAnnéeEnCours: Function): JSX.Element {
    if (this.annéesAvecDesTauxDAbsentéismes.length > 0) {
      return (
        <Select
          label={this.wording.ANNÉE}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setAnnéeEnCours(Number(event.target.value))
          }}
          options={this.annéesAvecDesTauxDAbsentéismes}
        />
      )
    }

    return <></>
  }

  public get lesDonnéesRessourcesHumainesNeSontPasRenseignées(): boolean {
    return !this.leNombreDEtpRéaliséEstIlRenseigné && !this.leTauxDeRotationDuPersonnelEstIlRenseigné
  }

  private get leNombreDEtpRéaliséEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDEtpRéalisés.valeur !== null)
  }

  public get nombreDEtpRéalisé(): ReactElement {
    const [valeurs, années] = this.construisLesNombresDEtpRéalisés()
    const couleursDeLHistogramme = années.map((année) => ({
      premierPlan: this.estCeLAnnéePassée(année) ? this.couleurDuFondHistogrammePrimaire : this.couleurDuFondHistogrammeSecondaire,
      secondPlan: this.couleurDuFond,
    }))
    const libellésDesValeurs = Array(valeurs.length).fill({ couleur: this.couleurIdentifiant })
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: this.estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }))
    const annéesManquantes = this.annéesManquantes(années)

    return this.afficheUnHistogrammeHorizontal(
      valeurs,
      années,
      couleursDeLHistogramme,
      libellésDesValeurs,
      libellésDesTicks,
      this.RATIO_HISTOGRAMME_HORIZONTAL,
      this.wording.ANNÉE,
      this.wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION,
      annéesManquantes
    )
  }

  public get dateDeMiseÀJourDuNombreDEtpRéalisé(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].nombreDEtpRéalisés.dateMiseÀJourSource)
  }

  private get leTauxDeRotationDuPersonnelEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.tauxDeRotationDuPersonnel.valeur !== null)
  }

  public get tauxDeRotationDuPersonnel(): JSX.Element {
    const [valeurs, années] = this.construisLesTauxDeRotationDuPersonnel()
    const construisLaCouleurDeLaBarreDeLHistogramme = (valeur: number, année: string | number) => {
      if (!this.leTauxDeRotationDuPersonnelEstIlDansLesBornesAcceptables(valeur)) {
        return {
          premierPlan: this.couleurDuFondHistogrammeDeDépassement,
          secondPlan: this.couleurSecondPlanHistogrammeDeDépassement,
        }
      }

      if (this.estCeLAnnéePassée(année)) {
        return {
          premierPlan: this.couleurDuFondHistogrammePrimaire,
          secondPlan: this.couleurDuFond,
        }
      }

      return {
        premierPlan: this.couleurDuFondHistogrammeSecondaire,
        secondPlan: this.couleurDuFond,
      }
    }
    const libellésDesValeurs = Array(valeurs.length).fill({ couleur: this.couleurDuFond })
    const libellésDesTicks = années.map((année) => ({ tailleDePolice: this.estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }))

    return this.afficheUnHistogrammeVertical(
      valeurs,
      années,
      this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarreDeLHistogramme),
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ANNÉE,
      this.wording.TAUX_DE_ROTATION_DU_PERSONNEL
    )
  }

  private leTauxDeRotationDuPersonnelEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur >= 0 && valeur <= this.SEUIL_DU_TAUX_DE_ROTATION_DU_PERSONNEL_ATYPIQUE
  }

  public get dateDeMiseÀJourDuTauxDeRotationDuPersonnel(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].tauxDeRotationDuPersonnel.dateMiseÀJourSource)
  }

  public tauxDAbsentéisme(annéeEnCours: number): ReactElement {
    if (!annéeEnCours) return this.pasDeTauxDAbsentéisme

    const tauxDAbsentéismesDeLAnnéeEnCours = this.trouveLesTauxDAbsentéismesDeLAnnée(annéeEnCours)
    const [valeursAvecMotif, tauxDAbsentéismeHorsFormation] = this.construisLesTauxDAbsentéisme(tauxDAbsentéismesDeLAnnéeEnCours)
    const couleursDuDoughnut: CouleurHistogramme[] = []
    const libellésDesValeurs: LibelléDeDonnéeGraphe[] = []
    valeursAvecMotif.forEach((tauxDAbsentéisme) => {
      if (!this.leTauxDAbsentéismeDUnMotifEstIlDansLesBornesAcceptables(tauxDAbsentéisme.valeur)) {
        couleursDuDoughnut.push({
          premierPlan: this.couleurDuFondHistogrammeDeDépassement,
          secondPlan: this.couleurSecondPlanHistogrammeDeDépassement,
        })
        libellésDesValeurs.push({ couleur: this.couleurDuFond })
      } else {
        couleursDuDoughnut.push(this.associeLaCouleurDeLArcAuMotifDuTauxDAbsentéisme(tauxDAbsentéisme.motif))
        libellésDesValeurs.push(this.associeLaCouleurDuLibelléAuMotifDAbsentéisme(tauxDAbsentéisme.motif))
      }
    })
    const valeursDesTauxDAbsentéismes = valeursAvecMotif.map((tauxDAbsentéisme) => tauxDAbsentéisme.valeur)
    const motifsDesTauxDAbsentéismes = valeursAvecMotif.map((tauxDAbsentéisme) => tauxDAbsentéisme.motif)
    const pourcentageDuTauxDAbsentéismeHorsFormation = StringFormater.ajouteLePourcentage([tauxDAbsentéismeHorsFormation])[0]
    const texteCentral = this.leTauxDAbsentéismeHorsFormationEstIlDansLesBornesAcceptables(tauxDAbsentéismeHorsFormation)
      ? pourcentageDuTauxDAbsentéismeHorsFormation
      : `! ${pourcentageDuTauxDAbsentéismeHorsFormation}`

    const annéesManquantes = this.annéesManquantes(this.annéesAvecDesTauxDAbsentéismes)

    return (
      <>
        {this.wording.TAUX_D_ABSENTÉISME_HORS_FORMATION(
          pourcentageDuTauxDAbsentéismeHorsFormation,
          !this.leTauxDAbsentéismeHorsFormationEstIlDansLesBornesAcceptables(tauxDAbsentéismeHorsFormation),
          this.leTauxDAbsentéismeHorsFormationEstIlNul(tauxDAbsentéismeHorsFormation)
        )}
        {!this.leTauxDAbsentéismeHorsFormationEstIlNul(tauxDAbsentéismeHorsFormation) &&
        this.afficheUnDiagrammeEnDonut(
          valeursDesTauxDAbsentéismes,
          motifsDesTauxDAbsentéismes,
          couleursDuDoughnut,
          libellésDesValeurs,
          texteCentral,
          tauxDAbsentéismeHorsFormation,
          this.IDENTIFIANT_DE_LA_LÉGENDE_DES_TAUX_D_ABSENTÉISMES
        )}
        {annéesManquantes.length > 0 && <MiseEnExergue>
          {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(', ')}`}
        </MiseEnExergue>}
        <TableIndicateur
          disabled={annéesManquantes.length === 3}
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[this.wording.TAUX_D_ABSENTÉISME]}
          libellés={motifsDesTauxDAbsentéismes}
          valeurs={[StringFormater.ajouteLePourcentage(valeursDesTauxDAbsentéismes)]}
        />
      </>
    )
  }

  private get pasDeTauxDAbsentéisme(): ReactElement {
    const annéesManquantes = this.annéesManquantes(this.annéesAvecDesTauxDAbsentéismes)

    return (
      <>
        {annéesManquantes.length > 0 && <MiseEnExergue>
          {`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(', ')}`}
        </MiseEnExergue>}
        <TableIndicateur
          disabled={true}
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[this.wording.TAUX_D_ABSENTÉISME]}
          libellés={[]}
          valeurs={[]}
        />
      </>
    )
  }

  public get dateDeMiseÀJourDesTauxDAbsentéismes(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].tauxDAbsentéisme.dateMiseÀJourSource)
  }

  private construisLesTauxDAbsentéisme(
    tauxDAbsentéismesDeLAnnéeEnCours: ÉtablissementTerritorialMédicoSocialRessourcesHumaines['tauxDAbsentéisme']
  ): [{valeur: number, motif: string}[], number] {
    const valeursAvecMotif = []

    const tauxDAbsentéismeHorsFormation = StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.horsFormation || 0)

    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieCourteDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieCourteDurée as number),
      })
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieMoyenneDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieMoyenneDurée as number),
      })
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieLongueDurée)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaladieLongueDurée as number),
      })
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourAccidentMaladieProfessionnelle)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourAccidentMaladieProfessionnelle as number),
      })
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourMaternitéPaternité)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourMaternitéPaternité as number),
      })
    }
    if (this.leTauxEstIlRenseigné(tauxDAbsentéismesDeLAnnéeEnCours.pourCongésSpéciaux)) {
      valeursAvecMotif.push({
        motif: this.wording.TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX,
        valeur: StringFormater.transformeEnTaux(tauxDAbsentéismesDeLAnnéeEnCours.pourCongésSpéciaux as number),
      })
    }

    return [valeursAvecMotif, tauxDAbsentéismeHorsFormation]
  }

  private trouveLesTauxDAbsentéismesDeLAnnée(annéeEnCours: number) {
    return this.ressourcesHumainesMédicoSocial.find((ressourcesHumaines) => ressourcesHumaines.année === annéeEnCours)
      ?.tauxDAbsentéisme as ÉtablissementTerritorialMédicoSocialRessourcesHumaines['tauxDAbsentéisme']
  }

  private leTauxDAbsentéismeDUnMotifEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur < this.BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_PAR_MOTIF
  }

  private leTauxDAbsentéismeHorsFormationEstIlDansLesBornesAcceptables(valeur: number) {
    return valeur < this.BORNE_MAXIMALE_TAUX_D_ABSENTÉISME_HORS_FORMATION
  }

  private leTauxDAbsentéismeHorsFormationEstIlNul(valeur: number) {
    return valeur === 0
  }

  private leTauxEstIlRenseigné(tauxDAbsentéismes: number | null) {
    return tauxDAbsentéismes !== null && tauxDAbsentéismes !== 0
  }

  private associeLaCouleurDeLArcAuMotifDuTauxDAbsentéisme(motif: string) {
    return {
      premierPlan: this.couleursDuDoughnutDesTauxDAbsentéismes[motif].couleurDeLArc,
      secondPlan: this.couleursDuDoughnutDesTauxDAbsentéismes[motif].couleurDeLArc,
    }
  }

  private associeLaCouleurDuLibelléAuMotifDAbsentéisme(motif: string) {
    return { couleur: this.couleursDuDoughnutDesTauxDAbsentéismes[motif].couleurDuLibellé }
  }

  private construisLesNombresDEtpRéalisés(): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.ressourcesHumainesMédicoSocial.forEach((ressourceHumaineMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines) => {
      const valeur = ressourceHumaineMédicoSocial.nombreDEtpRéalisés.valeur
      if (valeur !== null) {
        années.push(ressourceHumaineMédicoSocial.année)
        valeurs.push(valeur)
      }
    })

    return [valeurs, années]
  }

  private construisLesTauxDeRotationDuPersonnel(): number[][] {
    const valeurs: number[] = []
    const années: number[] = []
    this.ressourcesHumainesMédicoSocial.forEach((ressourceHumaineMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines) => {
      const valeur = ressourceHumaineMédicoSocial.tauxDeRotationDuPersonnel.valeur
      if (valeur !== null) {
        années.push(ressourceHumaineMédicoSocial.année)
        valeurs.push(StringFormater.transformeEnTaux(valeur))
      }
    })

    return [valeurs, années]
  }

  private annéesRangéesParAntéChronologie(): number[] {
    return this.ressourcesHumainesMédicoSocial
      .filter(filtreParPrésenceDesTauxDAbsentéisme)
      .map((ressourcesHumaines) => ressourcesHumaines.année)
      .reverse()

    function filtreParPrésenceDesTauxDAbsentéisme(ressourcesHumaines: ÉtablissementTerritorialMédicoSocialRessourcesHumaines): boolean {
      if (
        ressourcesHumaines.tauxDAbsentéisme.horsFormation !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaladieCourteDurée !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaladieMoyenneDurée !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaladieLongueDurée !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourMaternitéPaternité !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourAccidentMaladieProfessionnelle !== null ||
        ressourcesHumaines.tauxDAbsentéisme.pourCongésSpéciaux !== null
      ) {
        return true
      }
      return false
    }
  }
}
