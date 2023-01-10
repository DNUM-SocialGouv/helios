import * as hbs from 'hbs'
import { readFileSync } from 'fs'

describe('Footer', () => {
  it('should contain a link', () => {
    // GIVEN
    const footerTemplate = readFileSync('./views/partials/footer.hbs', 'utf8')
    const compileFooter = hbs.handlebars.compile(footerTemplate)

    // WHEN
    const result = compileFooter({ toto: 'tata' })

    // THEN
    const doc = document.createElement('div')
    doc.innerHTML = result
    const link = doc.querySelector('a')
    expect(link.hasAttribute('href')).toBeTruthy()
  })
})
