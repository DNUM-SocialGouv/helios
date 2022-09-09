type Régions = Readonly<{
  [key: string]: Readonly<{
    label: string,
    source: string,
  }>
}>

const LIEN_ATLAS_SANTÉ = 'https://carto.atlasante.fr/1/helios_metropole.map?object=Région;insee_reg;'

export const régions: Régions = {
  'auvergne-rhone-alpes': {
    label: 'Auvergne Rhône Alpes',
    source: `${LIEN_ATLAS_SANTÉ}84`,
  },
  bretagne: {
    label: 'Bretagne',
    source: `${LIEN_ATLAS_SANTÉ}53`,
  },
  occitanie: {
    label: 'Occitanie',
    source: `${LIEN_ATLAS_SANTÉ}76`,
  },
  'pays-de-la-loire': {
    label: 'Pays de la Loire',
    source: `${LIEN_ATLAS_SANTÉ}52`,
  },
}
