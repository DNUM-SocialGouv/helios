type Régions = Readonly<{
  [key: string]: Readonly<{
    label: string;
    source: string;
  }>;
}>;

const LIEN_FRANCE_METROPOLITAINE = "https://carto.atlasante.fr/1/helios_metropole.map";
const LIEN_OUTRE_MER = "https://carto.atlasante.fr/1/helios_outremer.map";

export const régions: Régions = {
  "france-metropolitaine": {
    label: "France métropolitaine",
    source: `${LIEN_FRANCE_METROPOLITAINE}`,
  },
  "outre-mer": {
    label: "Outre-mer (DROM-COM)",
    source: `${LIEN_OUTRE_MER}`,
  },
};
