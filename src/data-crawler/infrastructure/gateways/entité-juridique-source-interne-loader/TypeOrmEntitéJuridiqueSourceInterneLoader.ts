import { DataSource } from 'typeorm'

import { EntitéJuridiqueSourceInterneLoader } from '../../../métier/gateways/EntitéJuridiqueSourceInterneLoader'

export class TypeOrmEntitéJuridiqueSourceInterneLoader implements EntitéJuridiqueSourceInterneLoader{
  constructor(private readonly orm: Promise<DataSource>) {}
  public récupèreLeNuméroFinessDesEntitésJuridiques(): string[]{
    return []
  }

}
