import { readFileSync } from 'fs'
import convert from 'xml-js'

import { HeliosError } from '../../entities/HeliosError'
import { XmlToJs } from '../../entities/XmlToJs'

export class NodeXmlToJs implements XmlToJs {
  handle<T>(xmlPath: string): T {
    try {
      const xml = readFileSync(xmlPath, 'utf8')

      return convert.xml2js(xml, {
        compact: true,
        ignoreAttributes: true,
        ignoreDeclaration: true,
      }) as T
    } catch (error) {
      throw new HeliosError(`Une erreur est survenue lors de la lecture du fichier ${xmlPath} : ${error.message}`)
    }
  }
}
