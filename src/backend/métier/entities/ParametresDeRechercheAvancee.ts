export type OrderDir = "ASC" | "DESC" | undefined;

export type CapaciteSMS = {
  classification: string;
  ranges: string[];
};

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
