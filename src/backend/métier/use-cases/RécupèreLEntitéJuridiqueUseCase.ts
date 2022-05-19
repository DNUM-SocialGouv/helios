export class RécupèreLEntitéJuridiqueUseCase {

  exécute(numéroFINESS: string) {
    return {
      adresseNuméroVoie: '6',
      adresseTypeVoie: 'AV',
      adresseVoie: 'rue de la Paix',
      nom: 'Nom de l’entité juridique',
      numéroFINESS,
      statut: 'statut',
      téléphone: '0123456789',
    }
  }
}
