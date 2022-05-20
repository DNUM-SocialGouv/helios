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
    return this.entitéJuridique.numéroFinessEntitéJuridique
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
    return téléphone.split('').map((letter, index) => index % 2 ? letter + ' ' : letter).join('').trimEnd()
  }

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
}
