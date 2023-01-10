import { Controller, Get, Render } from '@nestjs/common'
import { Entité } from '../../domain/Entité'

@Controller('/spike')
export class SpikeEndpoint {
  @Get()
  @Render('index')
  home() {
    const entité = new Entité()
    console.log(entité)

    return entité
  }
}
