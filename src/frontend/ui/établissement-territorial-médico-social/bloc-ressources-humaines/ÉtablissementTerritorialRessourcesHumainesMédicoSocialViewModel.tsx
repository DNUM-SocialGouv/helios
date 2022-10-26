import { ReactElement } from 'react'

import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines'
import { Wording } from '../../../configuration/wording/Wording'
import { GraphiqueViewModel } from '../../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../../commun/StringFormater'

export class ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly RATIO_HISTOGRAMME_HORIZONTAL = 2
  private readonly SEUIL_DU_TAUX_DE_ROTATION_DU_PERSONNEL_ATYPIQUE: number = 50

  constructor(
    private readonly ressourcesHumainesMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines[],
    wording: Wording
  ) {
    super(wording)
  }

  public get lesDonnéesRessourcesHumainesNeSontPasRenseignées(): boolean {
    return !this.leNombreDEtpRéaliséEstIlRenseigné &&
      !this.leTauxDeRotationDuPersonnelEstIlRenseigné
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
          secondPlan : this.couleurSecondPlanHistogrammeDeDépassement,
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
}
