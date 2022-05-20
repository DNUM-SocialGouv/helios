import { EntitéJuridique } from '../../../backend/métier/entities/EntitéJuridique'

export class EntitéJuridiqueViewModel {
  constructor(private readonly entitéJuridique: EntitéJuridique) {}

  public get titre(): string {
    return `EJ - ${this.numéroFiness} - ${this.nomDeLÉtablissement}`
  }

  public get nomDeLÉtablissement(): string {
    return this.entitéJuridique.raisonSociale
  }

  public get numéroFiness(): string {
    return this.insèreUnEspaceTousLesNCaractères(this.entitéJuridique.numéroFinessEntitéJuridique, 3)
  }

  public get adresse(): string {
    return `${this.entitéJuridique.adresseNuméroVoie} ${this.entitéJuridique.adresseTypeVoie} ${this.entitéJuridique.adresseVoie} ${this.entitéJuridique.adresseAcheminement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.entitéJuridique.libelléStatutJuridique
  }

  public get téléphone(): string {
    return this.formateLeNuméroDeTéléphone(this.entitéJuridique.téléphone)
  }

  public get dateDeMiseÀJour(): string {
    return this.formateLaDate(this.entitéJuridique.dateMiseAJourSource)
  }

  private formateLeNuméroDeTéléphone(téléphone: string): string {
    return this.insèreUnEspaceTousLesNCaractères(téléphone, 2)
  }

  private insèreUnEspaceTousLesNCaractères(str: string, nombreDeCaractères: number): string {
    return str.split('').map((letter, index) => index % nombreDeCaractères === 0 ? ' ' + letter : letter).join('').trim()
  }

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
}
