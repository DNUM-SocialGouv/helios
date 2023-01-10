export type ÉtablissementTerritorialMédicoSocialRessourcesHumaines = Readonly<{
  année: number
  nombreDEtpRéalisés: Readonly<{
    dateMiseÀJourSource: string
    valeur: number | null
  }>
  nombreDeCddDeRemplacement: Readonly<{
    dateMiseÀJourSource: string
    valeur: number | null
  }>
  tauxDePrestationsExternes: Readonly<{
    dateMiseÀJourSource: string
    valeur: number | null
  }>
  tauxDEtpVacants: Readonly<{
    dateMiseÀJourSource: string
    valeur: number | null
  }>
  tauxDeRotationDuPersonnel: Readonly<{
    dateMiseÀJourSource: string
    valeur: number | null
  }>
  tauxDAbsentéisme: Readonly<{
    dateMiseÀJourSource: string
    horsFormation: number | null
    pourMaladieCourteDurée: number | null
    pourMaladieMoyenneDurée: number | null
    pourMaladieLongueDurée: number | null
    pourMaternitéPaternité: number | null
    pourAccidentMaladieProfessionnelle: number | null
    pourCongésSpéciaux: number | null
  }>
}>
