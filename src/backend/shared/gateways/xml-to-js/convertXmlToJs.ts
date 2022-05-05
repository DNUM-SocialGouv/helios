import { readFileSync } from 'fs'
import convert from 'xml-js'

import { ConvertXmlToJs } from '../../entities/ConvertXmlToJs'

export const convertXmlToJs: ConvertXmlToJs = <T>(xmlPath: string): T => {
  try {
    const xml = readFileSync(xmlPath, 'utf8')

    return convert.xml2js(xml, {
      compact: true,
      ignoreAttributes: true,
      ignoreDeclaration: true,
    }) as T
  } catch (error) {
    throw new Error(`[Helios] Une erreur est survenue lors de la lecture du fichier ${xmlPath} : ${error.message}`)
  }
}
