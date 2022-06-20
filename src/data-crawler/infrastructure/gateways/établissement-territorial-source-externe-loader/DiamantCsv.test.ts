import { dsvFormat, DSVRowString, xml } from 'd3'
import { readFileSync } from 'fs'

describe('Lecture de fichier csv', () => {
  it('permet de lire un fichier CSV', async () => {
    const fichier = './ANN_ERRD_EJ_ET_2022_06_07.CSV'

    const toto = dsvFormat(';')
      .parse(
        readFileSync(fichier, { encoding: 'latin1' }),
        (rawRow: DSVRowString<string>) => {
          return {
            année: rawRow['Année'],
            litsAccueil: Number(rawRow['Taux d\'occupation des lits autorisés en accueil de jour']),
            litsTemporaires: Number(rawRow['Taux d\'occupation des lits autorisés en hébergement temporaire']),
            numéroFiness: rawRow['Finess'],
            placesPermanentes: Number(rawRow['Taux d\'occupation des places autorisées en hébergement permanent']),
          }
        }
      )

    expect(toto[0]).toStrictEqual({
      année: '2020',
      litsAccueil: '',
      litsTemporaires: '',
      numéroFiness: '010780971',
      placesPermanentes: '',
    })
  })

  it.only('permet de lire un fichier xml', async () => {
    const fichier = './finess_cs1400101_stock_20211214-0333.xml'

    const toto = xml(fichier)

    expect(toto).toStrictEqual({
      année: '2020',
      litsAccueil: '',
      litsTemporaires: '',
      numéroFiness: '010780971',
      placesPermanentes: '',
    })
  })
})
