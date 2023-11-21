type Régions = Readonly<{
  [key: string]: Readonly<{
    label: string;
    source: string;
  }>;
}>;

export type OutreMerRegion = Readonly<{
  key: string;
  label: string;
  text: string;
  source: string;
}>;

const LIEN_FRANCE_METROPOLITAINE = "https://carto.atlasante.fr/1/helios_metropole.map";
const LIEN_OUTRE_MER = "https://carto.atlasante.fr/1/helios_outremer.map";

const LIEN_ARS1_GUADELOUPE = "https://carto.atlasante.fr/1/helios_outremer.map?object=R%C3%A9gion;insee_reg;01";
const LIEN_ARS2_GUYANE = "https://carto.atlasante.fr/1/helios_outremer.map?object=R%C3%A9gion;insee_reg;02";
const LIEN_ARS3_LA_REUNION = "https://carto.atlasante.fr/1/helios_outremer.map?object=R%C3%A9gion;insee_reg;03";
const LIEN_ARS4_MATINIQUE = "https://carto.atlasante.fr/1/helios_outremer.map?object=R%C3%A9gion;insee_reg;04";
const LIEN_ARS5_MAYOTTE = "https://carto.atlasante.fr/1/helios_outremer.map?object=R%C3%A9gion;insee_reg;05";

export const régions: Régions = {
  "france-metropolitaine": {
    label: "France métropolitaine",
    source: `${LIEN_FRANCE_METROPOLITAINE}`,
  },
  "outre-mer": {
    label: "Outre-mer (DROM-COM)",
    source: `${LIEN_OUTRE_MER}`,
  },
  "ARS1": {
    label: "Guadeloupe",
    source: `${LIEN_ARS1_GUADELOUPE}`,
  },
  "ARS2": {
    label: "Guyane",
    source: `${LIEN_ARS2_GUYANE}`,
  },
  "ARS3": {
    label: "La Réunion",
    source: `${LIEN_ARS3_LA_REUNION}`,
  },
  "ARS4": {
    label: "Martinique",
    source: `${LIEN_ARS4_MATINIQUE}`,
  },
  "ARS5": {
    label: "Mayotte",
    source: `${LIEN_ARS5_MAYOTTE}`,
  },
};

export const outreMerRegionsList: OutreMerRegion[] = [
  {
    key: 'ARS1',
    label: 'Guadeloupe',
    source: `${LIEN_ARS1_GUADELOUPE}`,
    text: 'Carte Guadeloupe'
  },
  {
    key: 'ARS2',
    label: 'Guyane',
    source: `${LIEN_ARS2_GUYANE}`,
    text: 'Carte Guyane'
  },
  {
    key: 'ARS3',
    label: 'La Réunion',
    source: `${LIEN_ARS3_LA_REUNION}`,
    text: 'Carte La Réunion'
  },
  {
    key: 'ARS4',
    label: 'Martinique',
    source: `${LIEN_ARS4_MATINIQUE}`,
    text: 'Carte Martinique'
  },
  {
    key: 'ARS5',
    label: 'Mayotte',
    source: `${LIEN_ARS5_MAYOTTE}`,
    text: 'Carte Mayotte'
  }
]
