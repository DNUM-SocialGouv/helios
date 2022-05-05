import { convertXmlToJs } from './convertXmlToJs'

describe('Conversion d’un fichier XML en un objet JavaScript', () => {
  it('convertir un fichier XML en un objet JavaScript', () => {
    // GIVEN
    const xmlPath = __dirname + '/structure_correct.xml'

    // WHEN
    const js = convertXmlToJs(xmlPath)

    // THEN
    expect(js).toStrictEqual({ structure: { key1: { _text: 'value1' }, key2: { _text: 'value2' } } })
  })

  it('une erreur est survenue car le chemin du fichier XML est incorrect', () => {
    // GIVEN
    const xmlPath = '/mauvais_chemin.xml'

    try {
      // WHEN
      convertXmlToJs(xmlPath)
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] Une erreur est survenue lors de la lecture du fichier ${xmlPath} : ENOENT: no such file or directory, open '${xmlPath}'`)
    }
  })

  it('une erreur est survenue car le XML est mal formaté', () => {
    // GIVEN
    const xmlPath = __dirname + '/structure_incorrect.xml'

    try {
      // WHEN
      convertXmlToJs(xmlPath)
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] Une erreur est survenue lors de la lecture du fichier ${xmlPath} : Unexpected close tag\nLine: 3\nColumn: 12\nChar: >`)
    }
  })
})
