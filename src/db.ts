const { PrimaryColumn, Column, DataSource, Entity } = require('typeorm')

@Entity({ name: 'EntitéJuridique' })
export class EntitéJuridiqueEntity {
  @Column('varchar', { name: 'adresseAcheminement' })
    adresseAcheminement!: string

  @Column('varchar', { name: 'adresseNuméroVoie' })
    adresseNuméroVoie!: string

  @Column('varchar', { name: 'adresseTypeVoie' })
    adresseTypeVoie!: string

  @Column('varchar', { name: 'adresseVoie' })
    adresseVoie!: string

  @Column('varchar', { name: 'libelléStatutJuridique' })
    libelléStatutJuridique!: string

  @PrimaryColumn('varchar', { name: 'numéroFinessEntitéJuridique' })
    numéroFinessEntitéJuridique!: string

  @Column('varchar', { name: 'raisonSociale' })
    raisonSociale!: string

  @Column('varchar', { name: 'téléphone' })
    téléphone!: string
}

const dataSourceInit = async (): Promise<typeof DataSource> => {
  const dataSource = new DataSource({
    database: 'helios',
    entities: [EntitéJuridiqueEntity],
    host: 'localhost',
    logging: 'all',
    password: 'h3li0s',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'helios',
  })

  return await dataSource.initialize()
}

async function toto(dataSourceInit: typeof DataSource) {
  const dataSource = await dataSourceInit()

  await dataSource
    .getRepository(EntitéJuridiqueEntity)
    .upsert([
      {
        adresseAcheminement: 'fake',
        adresseNuméroVoie: 'fake',
        adresseTypeVoie: 'fake',
        adresseVoie: 'fake',
        libelléStatutJuridique: 'fake',
        numéroFinessEntitéJuridique: '1',
        raisonSociale: 'fake2',
        téléphone: 'fake2',
      },
      {
        adresseAcheminement: 'fake',
        adresseNuméroVoie: 'fake',
        adresseTypeVoie: 'fake',
        adresseVoie: 'fake',
        libelléStatutJuridique: 'fake',
        numéroFinessEntitéJuridique: '2',
        raisonSociale: 'fake',
        téléphone: 'fake',
      },
    ],
    ['numéroFinessEntitéJuridique'])

  const ej = await dataSource.getRepository(EntitéJuridiqueEntity).findOneBy({ numéroFinessEntitéJuridique: 1 })
  console.log(ej)
}

toto(dataSourceInit)
