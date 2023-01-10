import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as hbs from 'hbs'
import { AppModule } from './AppModule'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs')

  const partialPath = join(__dirname, '..', 'views', 'partials')
  hbs.registerPartials(partialPath)
  app.useStaticAssets(join(__dirname, '/../public'))

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
