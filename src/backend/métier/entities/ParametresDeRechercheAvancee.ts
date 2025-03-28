import { CapaciteSMS, OrderDir } from "../use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase"

export type ParametreDeRechercheAvancee = Readonly<{
  terme: string,
  zone: string,
  zoneD: string,
  typeZone: string,
  type: string,
  statutJuridique: string[],
  capaciteSMS: CapaciteSMS[],
  order: OrderDir,
  orderBy: string,
  page: number,
  forExport: boolean
}>
