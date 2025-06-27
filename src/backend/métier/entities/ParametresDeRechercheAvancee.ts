export type OrderDir = "ASC" | "DESC" | undefined;

export type CapaciteSMS = {
  classification: string;
  ranges: string[];
};

export type ActiviteSAN = {
  classification: 'mco' | 'psy' | 'ssr' | 'usld';
  ranges: string[];
};
export type ParametreDeRechercheAvancee = Readonly<{
  terme: string,
  zone: string,
  zoneD: string,
  typeZone: string,
  type: string[],
  statutJuridique: string[],
  categories: string[],
  capaciteSMS: CapaciteSMS[],
  activiteSAN: ActiviteSAN[],
  order: OrderDir,
  orderBy: string,
  page: number,
  forExport: boolean
}>
