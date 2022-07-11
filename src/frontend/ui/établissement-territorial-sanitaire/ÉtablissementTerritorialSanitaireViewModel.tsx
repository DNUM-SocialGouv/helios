import {
  ChartData,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { ReactElement } from 'react'
import { Bar } from 'react-chartjs-2'

import { ÉtablissementTerritorialSanitaire } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Wording } from '../../configuration/wording/Wording'

export class ÉtablissementTerritorialSanitaireViewModel {
  readonly couleurDuFondHistogrammeBleuClair = '#DEE5FD'
  readonly couleurDuFondHistogrammeBleuFoncé = '#2F4077'
  readonly couleurDuFondHistogrammeVertClair = '#DFFDF7'
  readonly couleurDuFondHistogrammeVertFoncé = '#006A6F'
  readonly couleurDuFondHistogrammeRougeClair = '#FEE9E6'
  readonly couleurDuFondHistogrammeRougeFoncé = '#A94645'

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, private readonly wording: Wording) {}

  public get titre(): string {
    return `ET - ${this.numéroFinessÉtablissementTerritorial} - ${this.nomDeLÉtablissementTerritorial}`
  }

  public get titreAccessibleDeLEntitéJuridique(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;
        {'- '}
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement()}
      </>
    )
  }

  public get numéroFinessEntitéJuridiqueBrut(): string {
    return this.établissementTerritorial.identité.numéroFinessEntitéJuridique
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorial.identité.raisonSociale
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorial.identité.numéroFinessÉtablissementTerritorial, 3)
  }

  public get adresse(): string {
    return `${this.établissementTerritorial.identité.adresseNuméroVoie} ${this.établissementTerritorial.identité.adresseTypeVoie} ${this.établissementTerritorial.identité.adresseVoie} ${this.établissementTerritorial.identité.adresseAcheminement}`
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorial.identité.téléphone, 2))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorial.identité.courriel)
    return `${téléphoneFormaté} | ${email}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorial.identité.numéroFinessEntitéJuridique, 3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement
    return `EJ - ${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorial.identité.catégorieÉtablissement} - ${this.établissementTerritorial.identité.libelléCatégorieÉtablissement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorial.identité.statutJuridique
  }

  public get dateDeMiseÀJour(): string {
    return this.formateLaDate(this.établissementTerritorial.identité.dateMiseAJourSource)
  }

  public get nombreDeséjoursMCO(): JSX.Element {
    return this.afficheUnHistogrammeVertical()
  }

  private afficheUnHistogrammeVertical(): JSX.Element {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    )
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuClair,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: [30, 30, 30, 30, 30],
          label: 'Hospitalisation Partielle Médecine',
          stack: 'Stack 1',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuFoncé,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: [10, 20, 30, 15, 9],
          label: 'Hospitalisation Complète Médecine',
          stack: 'Stack 1',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertClair,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: [60, 60, 60, null, 60],
          label: 'Hospitalisation Partielle Chirurgie',
          stack: 'Stack 2',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertFoncé,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: [60, 20, 60, 30, 60],
          label: 'Hospitalisation Complète Chirurgie',
          stack: 'Stack 2',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeClair,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: [100, 100, 100, 100, 100],
          label: 'Hospitalisation Partielle Obstétrique',
          stack: 'Stack 3',
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeFoncé,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: [140, 140, 160, 180, 200],
          label: 'Hospitalisation Complète Obstétrique',
          stack: 'Stack 3',
        },
      ],
      labels: [2018, 2019, 2020, 2021, 2022],
    }

    const options = {
      elements: { bar: { borderWidth: 2 } },
      plugins: {
        legend: { align: 'end', position: 'bottom' as const },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label + ' : ' + context.parsed.y

              if (context.datasetIndex <= 1) {
                return [label, 'Total Hospitalisation Médecine : ' + (context.parsed._stacks.y['0'] + context.parsed._stacks.y['1'])]
              }
              if (context.datasetIndex === 2 || context.datasetIndex === 3) {
                return [label, 'Total Hospitalisation Chirurgie : ' + (context.parsed._stacks.y['2'] + context.parsed._stacks.y['3'])]
              }
              if (context.datasetIndex === 4 || context.datasetIndex === 5) {
                return [label, 'Total Hospitalisation Obstétrique : ' + (context.parsed._stacks.y['4'] + context.parsed._stacks.y['5'])]
              }
            },
          },
        },
      },
      responsive: true,
      scales: {
        x: { grid: { drawOnChartArea: false } },
        y: { grid: { color: this.couleurDuFondHistogrammeRougeFoncé }, stacked: true },
      },
    }

    return (
      <>
        <Bar
          // @ts-ignore
          data={data}
          // @ts-ignore
          options={options}
        />
      </>
    )
  }
  private formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorial.identité.numéroFinessEntitéJuridique,
      3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private insèreUnEspaceTousLesNCaractères(str: string, nombreDeCaractères: number): string {
    return str.split('').map((letter, index) => index % nombreDeCaractères === 0 ? ' ' + letter : letter).join('').trim()
  }

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }
}
