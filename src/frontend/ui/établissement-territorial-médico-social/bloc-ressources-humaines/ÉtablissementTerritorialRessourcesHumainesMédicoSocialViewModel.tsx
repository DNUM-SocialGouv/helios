import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines'
import { Wording } from '../../../configuration/wording/Wording'
import { GraphiqueViewModel } from '../../commun/Graphique/GraphiqueViewModel'
import { StringFormater } from '../../commun/StringFormater'

export class ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel extends GraphiqueViewModel {
  private readonly ratioHistogrammeHorizontal = 2

  constructor(
    private readonly ressourcesHumainesMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines[],
    wording: Wording
  ) {
    super(wording)
  }

  public get lesDonnéesRessourcesHumainesNeSontPasRenseignées(): boolean {
    return !this.leNombreDEtpRéaliséEstIlRenseigné
  }

  public get leNombreDEtpRéaliséEstIlRenseigné(): boolean {
    return this.ressourcesHumainesMédicoSocial.some((ressourceHumaine) => ressourceHumaine.nombreDEtpRéalisés !== null)
  }

  public get nombreDEtpRéalisé(): JSX.Element {
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
      this.ratioHistogrammeHorizontal,
      this.wording.ANNÉE,
      this.wording.NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION,
      annéesManquantes
    )
  }

  public get dateDeMiseÀJourDuNombreDEtpRéalisé(): string {
    return StringFormater.formateLaDate(this.ressourcesHumainesMédicoSocial[0].nombreDEtpRéalisés.dateMiseÀJourSource)
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
}
