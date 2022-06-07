import { DataSource } from 'typeorm'

import { EntitéJuridiqueHeliosLoader } from '../../../métier/gateways/EntitéJuridiqueHeliosLoader'

export class TypeOrmEntitéJuridiqueHeliosLoader implements EntitéJuridiqueHeliosLoader{
  constructor(private readonly orm: Promise<DataSource>) {}
  public récupèreLeNuméroFinessDesEntitésJuridiques(): string[]{
    return []
  }

}
