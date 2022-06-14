import { NodeXmlToJs } from './NodeXmlToJs'

describe('Convertis un fichier XML en un objet JavaScript', () => {
  it('convertis un fichier XML en un objet JavaScript', () => {
    // GIVEN
    const xmlPath = `${__dirname}/structure_correct.xml`
    const nodeXmlToJs = new NodeXmlToJs()

    // WHEN
    const js = nodeXmlToJs.exécute(xmlPath)

    // THEN
    expect(js).toStrictEqual({ structure: { key1: { _text: 'value1' }, key2: { _text: 'value2' } } })
  })

  it('signale une erreur car le chemin du fichier XML est incorrect', () => {
    // GIVEN
    const xmlPath = '/mauvais_chemin.xml'
    const nodeXmlToJs = new NodeXmlToJs()

    try {
      // WHEN
      nodeXmlToJs.exécute(xmlPath)
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] Une erreur est survenue lors de la lecture du fichier ${xmlPath} : ENOENT: no such file or directory, open '${xmlPath}'`)
    }
  })

  it('signale une erreur car le XML est mal formaté', () => {
    // GIVEN
    const xmlPath = `${__dirname}/structure_incorrect.xml`
    const nodeXmlToJs = new NodeXmlToJs()

    try {
      // WHEN
      nodeXmlToJs.exécute(xmlPath)
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] Une erreur est survenue lors de la lecture du fichier ${xmlPath} : Unexpected close tag\nLine: 3\nColumn: 12\nChar: >`)
    }
  })
})
