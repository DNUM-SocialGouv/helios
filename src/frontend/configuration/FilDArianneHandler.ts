export type FilDArianne = Readonly<{
  chemin: string
  label: string
}>[]

type Abonnement = (filDArianne: FilDArianne) => void
type Annulation = () => void

export class FilDArianneHandler {
  private filDArianne: FilDArianne = []
  private abonnements: Abonnement[] = []

  metAJourLeFilDArianne(filDArianne: FilDArianne) {
    this.filDArianne = filDArianne

    this.abonnements.forEach((diffuse) => diffuse(this.filDArianne))
  }

  ajouteAbonnement(nouvelAbonnement: (filDArianne: FilDArianne) => void): Annulation {
    this.abonnements.push(nouvelAbonnement)

    return () =>
      (this.abonnements = this.abonnements.filter((abonnementExistant) => abonnementExistant !== nouvelAbonnement))
  }
}
