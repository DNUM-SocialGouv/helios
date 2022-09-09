type Régions = Readonly<{
  [key: string]: Readonly<{
    label: string,
    source: string,
  }>
}>

const LIEN_ATLAS_SANTÉ = 'https://carto.atlasante.fr/1/helios_metropole.map?object=Région;insee_reg;'
const CODE_INSEE_AUVERGNE_RHONE_ALPES = 84
const CODE_INSEE_BRETAGNE = 53
const CODE_INSEE_OCCITANIE = 76
const CODE_INSEE_PAYS_DE_LA_LOIRE = 52

export const régions: Régions = {
  'auvergne-rhone-alpes': {
    label: 'Auvergne Rhône Alpes',
    source: `${LIEN_ATLAS_SANTÉ}${CODE_INSEE_AUVERGNE_RHONE_ALPES}`,
  },
  bretagne: {
    label: 'Bretagne',
    source: `${LIEN_ATLAS_SANTÉ}${CODE_INSEE_BRETAGNE}`,
  },
  occitanie: {
    label: 'Occitanie',
    source: `${LIEN_ATLAS_SANTÉ}${CODE_INSEE_OCCITANIE}`,
  },
  'pays-de-la-loire': {
    label: 'Pays de la Loire',
    source: `${LIEN_ATLAS_SANTÉ}${CODE_INSEE_PAYS_DE_LA_LOIRE}`,
  },
}
