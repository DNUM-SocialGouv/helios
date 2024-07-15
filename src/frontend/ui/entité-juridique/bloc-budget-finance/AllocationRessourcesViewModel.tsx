import { ReactElement } from "react";

import {
  AllocationValeursAvecMotif,
  DataRowEntitéJuridiqueAllocationRessources,
  EntitéJuridiqueAllocationRessources,
  IAllocationRessources,
  IEnveloppe,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAllocationRessources";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { CouleurHistogramme, noir } from "../../commun/Graphique/couleursGraphique";
import { DonutNoCenterText, couleurDesArcsDuDonut } from "../../commun/Graphique/DonutNoCenterText";
import { MiseEnExergue } from "../../commun/MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../../commun/StringFormater";
import { Transcription } from "../../commun/Transcription/Transcription";
import { DetailsAllocations } from "./allocation-ressources/SousEnveloppes/DetailsAllocations";


export function convertFloatToComma(number: number) {

  // Convert the number to a string
  let numberString = number.toString();

  if (numberString === '0.0' || numberString === '-0.0') return '';

  if (numberString.endsWith('.0')) {
    numberString = numberString.slice(0, -2);
  }

  // Replace the period with a comma
  return numberString.replace('.', ',');
}

export function formatNumbuerWithSpaces(number: number) {

  const numberV2 = parseFloat(number.toFixed(2))

  // Convertir le nombre en une chaîne de caractères
  const numberString = numberV2.toString();
  // Utiliser une expression régulière pour ajouter des espaces tous les trois chiffres
  // La regex (?=(?:\d{3})+(?!\d)) est utilisée pour placer les espaces
  const formattedString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedString;
}

export class AllocationRessourcesViewModel {
  public allocationRessourcesData: IAllocationRessources;
  private NOMBRE_ANNEES = 5;
  private readonly couleursDuDoughnutDesAllocationDeRessource: Record<string, { couleurDeLArc: string; couleurDuLibellé: string }>;
  private readonly annéesAvecDesAllocationDeRessource: number[];
  private readonly IDENTIFIANT_DE_LA_LÉGENDE_DES_ALLOCATION_RESSOURCES = "légende-graphique-entite-juridique-allocation-ressources";
  private wording: Wording;
  private autorisations: any;

  constructor(allocationRessources: IAllocationRessources, wording: Wording, autorisations: any) {
    this.wording = wording;

    this.allocationRessourcesData = allocationRessources;

    this.couleursDuDoughnutDesAllocationDeRessource = {
      [this.wording.DAF]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[0], couleurDuLibellé: noir },
      [this.wording.DOTATIONS_ACTIVITÉ]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[1], couleurDuLibellé: noir },
      [this.wording.DOTATIONS_DE_SOINS_USLD]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[2], couleurDuLibellé: noir },
      [this.wording.DOTATIONS_URGENCES]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[3], couleurDuLibellé: noir },
      [this.wording.FIR]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[4], couleurDuLibellé: noir },
      [this.wording.FORFAITS]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[5], couleurDuLibellé: noir },
      [this.wording.MIGAC]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[6], couleurDuLibellé: noir },
      [this.wording.ODMCO]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[7], couleurDuLibellé: noir },
      [this.wording.ODSV]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[8], couleurDuLibellé: noir },
      [this.wording.OGD_PA]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[9], couleurDuLibellé: noir },
      [this.wording.OGD_PH]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[10], couleurDuLibellé: noir },
      [this.wording.OBJECTIF_QUANTIFIÉ_NATIONAL]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[11], couleurDuLibellé: noir },
    };

    this.annéesAvecDesAllocationDeRessource = this.lesAnnéesEffectivesDuAllocationRessources();

    this.autorisations = autorisations;
  }

  public get annéeInitiale() {

    if (this.allocationRessourcesData && this.allocationRessourcesData.data) {
      const years = this.allocationRessourcesData.data
        .filter((allocationRessources) => !this.allocationRessourcesVide(allocationRessources))
        .map((allocationRessources) => allocationRessources.année);
      const anneesTriees = years.sort((année1, année2) => année1 - année2);

      return anneesTriees[0];
    }
    return 0;
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.allocationRessourcesData?.dateMiseÀJourSource as string);
  }

  public allocationRessourcesEnCours(annéeEnCours: number): EntitéJuridiqueAllocationRessources {
    return this.allocationRessourcesData.data.find(
      (allocationRessources) => allocationRessources.année === annéeEnCours
    ) as EntitéJuridiqueAllocationRessources;
  }

  allocationRessourcesEnCoursGroubByEnveloppe(annéeEnCours: number): any {
    const dataAllocationRessources = this.allocationRessourcesEnCours(annéeEnCours);
    return this.allocationRessourcesGroubByEnveloppe(dataAllocationRessources.allocationRessoure);
  }

  allocationRessourcesGroubByEnveloppeWithValues(data: DataRowEntitéJuridiqueAllocationRessources[]) {
    const groupedData = data.reduce((acc, item) => {
      if (item.enveloppe) {
        if (!acc[item.enveloppe]) {
          acc[item.enveloppe] = { motif: item.enveloppe, valeur: 0 };
        }
        if (item.montantNotifié !== null && item.montantNotifié !== "") {
          acc[item.enveloppe].valeur += item.montantNotifié;
        }
      }
      return acc;
    }, {} as { [key: string]: AllocationValeursAvecMotif });

    return Object.values(groupedData);
  }

  allocationRessourcesGroubByEnveloppe(data: DataRowEntitéJuridiqueAllocationRessources[]) {
    // Calculer le montant total des montants notifiés
    const total = data.reduce((sum, item) => {
      if (item.montantNotifié !== null && item.montantNotifié !== "") {
        return sum + item.montantNotifié;
      }
      return sum;
    }, 0);

    // Grouper les montants par enveloppe et calculer les valeurs totales pour chaque enveloppe
    const groupedData = data.reduce((acc, item) => {
      if (item.enveloppe) {
        if (!acc[item.enveloppe]) {
          acc[item.enveloppe] = { motif: item.enveloppe, valeur: 0 };
        }
        if (item.montantNotifié !== null && item.montantNotifié !== "") {
          acc[item.enveloppe].valeur += item.montantNotifié;
        }
      }
      return acc;
    }, {} as { [key: string]: AllocationValeursAvecMotif });

    // Convertir les valeurs totales en pourcentages
    const percentageData = Object.values(groupedData).map((item) => {
      item.valeur = (item.valeur / total) * 100;
      return item;
    });

    // Trier les données par valeur en ordre décroissant
    percentageData.sort((a, b) => b.valeur - a.valeur);

    return percentageData;
  }

  allocationRessourcesGroubByEnveloppeSousEnvelopeETMode(data: DataRowEntitéJuridiqueAllocationRessources[]) {
    // Regrouper les données par enveloppe, sous-enveloppe et mode de délégation
    const groupedData = data.reduce((acc: Record<string, any>, item: DataRowEntitéJuridiqueAllocationRessources) => {
      const { enveloppe, sousEnveloppe, modeDeDélégation, montantNotifié } = item;

      if (enveloppe) {
        if (!acc[enveloppe]) {
          acc[enveloppe] = { total: 0, sousEnveloppes: {} };
        }
        if (sousEnveloppe) {
          if (!acc[enveloppe].sousEnveloppes[sousEnveloppe]) {
            acc[enveloppe].sousEnveloppes[sousEnveloppe] = { total: 0, modesDeDélégation: {} };
          }
          if (modeDeDélégation) {
            if (!acc[enveloppe].sousEnveloppes[sousEnveloppe].modesDeDélégation[modeDeDélégation]) {
              acc[enveloppe].sousEnveloppes[sousEnveloppe].modesDeDélégation[modeDeDélégation] = 0;
            }
            acc[enveloppe].sousEnveloppes[sousEnveloppe].modesDeDélégation[modeDeDélégation] += montantNotifié;
          }

          acc[enveloppe].sousEnveloppes[sousEnveloppe].total += montantNotifié;
        }
        acc[enveloppe].total += montantNotifié;
      }
      return acc;
    }, {});

    // Calculer le total général
    const totalGeneral = Object.values(groupedData).reduce((sum, { total }) => sum + total, 0);

    // Préparer les résultats finaux
    const result = Object.keys(groupedData)
      .map((enveloppe) => {
        const totalEnveloppe = groupedData[enveloppe].total;
        const pourcentageEnveloppe = ((totalEnveloppe / totalGeneral) * 100).toFixed(1); // Garde 1 décimales
        const sousEnveloppes = groupedData[enveloppe].sousEnveloppes;

        // Trier les sous-enveloppes par pourcentage décroissant
        const sousEnveloppesResult = Object.keys(sousEnveloppes)
          .map((sousEnveloppe) => {
            const totalSousEnveloppe = sousEnveloppes[sousEnveloppe].total;
            const pourcentageSousEnveloppe = ((totalSousEnveloppe / totalEnveloppe) * 100).toFixed(1); // Garde 1 décimales
            const modesDeDélégation = sousEnveloppes[sousEnveloppe].modesDeDélégation;

            // Trier les modes de délégation par pourcentage décroissant
            const modesDeDélégationResult = Object.keys(modesDeDélégation)
              .map((modeDeDélégation) => {
                const montantNotifié = modesDeDélégation[modeDeDélégation];
                const pourcentageModeDeDélégation = ((montantNotifié / totalSousEnveloppe) * 100).toFixed(1); // Garde 1 décimales
                return { modeDeDélégation, montantNotifié, pourcentage: pourcentageModeDeDélégation };
              })
              .sort((a, b) => parseFloat(b.pourcentage) - parseFloat(a.pourcentage)); // Tri par pourcentage décroissant

            return { sousEnveloppe, total: totalSousEnveloppe, pourcentage: pourcentageSousEnveloppe, modesDeDélégation: modesDeDélégationResult };
          })
          .sort((a, b) => parseFloat(b.pourcentage) - parseFloat(a.pourcentage)); // Tri par pourcentage décroissant

        return { enveloppe, total: totalEnveloppe, pourcentage: pourcentageEnveloppe, sousEnveloppes: sousEnveloppesResult };
      })
      .sort((a, b) => parseFloat(b.pourcentage) - parseFloat(a.pourcentage)); // Tri par pourcentage décroissant

    return result;
  }

  transformDataToTranscriptionData(data: IEnveloppe[]) {
    const result: { key: string; value: any }[] = [];

    data.forEach((enveloppeItem) => {
      // Ajouter l'objet pour l'enveloppe principale
      result.push({ key: `Enveloppe: ${enveloppeItem.enveloppe}`, value: formatNumbuerWithSpaces(enveloppeItem.total) + " €" });

      // Traiter les sous-enveloppes
      enveloppeItem.sousEnveloppes.forEach((sousEnveloppeItem) => {
        result.push({ key: `Sous Enveloppe: ${sousEnveloppeItem.sousEnveloppe}`, value: `${formatNumbuerWithSpaces(sousEnveloppeItem.total)} € (${convertFloatToComma(sousEnveloppeItem.pourcentage)}%)` });

        // Traiter les modes de délégation
        sousEnveloppeItem.modesDeDélégation.forEach((modeDeDélégationItem) => {
          result.push({
            key: `Mode de délégation: ${modeDeDélégationItem.modeDeDélégation}`,
            value: convertFloatToComma(modeDeDélégationItem.pourcentage) !== '' ? `${formatNumbuerWithSpaces(modeDeDélégationItem.montantNotifié)} € (${convertFloatToComma(modeDeDélégationItem.pourcentage)}%)` : `${formatNumbuerWithSpaces(modeDeDélégationItem.montantNotifié)} €`,
          });
        });
      });
    });

    return result;
  }

  allocationRessourcesEnCoursGroubByEnveloppeSousEnvelopeETMode(annéeEnCours: number): any {
    const dataAllocationRessources = this.allocationRessourcesEnCours(annéeEnCours);
    return this.allocationRessourcesGroubByEnveloppeSousEnvelopeETMode(dataAllocationRessources.allocationRessoure);
  }

  public anneesAvecAllocationRessources(allocations: EntitéJuridiqueAllocationRessources[]): number[] {
    if (allocations) {
      return allocations.filter((allocation) => !this.allocationRessourcesVide(allocation)).map((allocation) => allocation.année);
    }
    return [];
  }

  private get pasDeAllocationDeRessource(): ReactElement {
    const listeAnnéesManquantes = annéesManquantes(this.annéesAvecDesAllocationDeRessource);

    return (
      <>
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <Transcription disabled={true} entêteLibellé={this.wording.ANNÉE} identifiants={[this.wording.TAUX_D_ABSENTÉISME]} libellés={[]} valeurs={[]} />
      </>
    );
  }

  public lesAnnéesEffectivesDuAllocationRessources(): number[] {
    if (this.allocationRessourcesData && this.allocationRessourcesData.data) {
      return this.allocationRessourcesData.data
        .filter((allocationRessources) => !this.allocationRessourcesVide(allocationRessources))
        .map((allocationRessources) => allocationRessources.année);
    }
    return [];
  }

  public lesAnnéesManquantesDuAllocationRessources(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuAllocationRessources(), this.NOMBRE_ANNEES);
  }

  public vide() {
    return this.allocationRessourcesData.data.every(this.allocationRessourcesVide);
  }

  public get estIlAutorisé() {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinance &&
      this.autorisations.budgetEtFinance.allocationDeRessources &&
      this.autorisations.budgetEtFinance.allocationDeRessources === 'ok') {
      return true
    }
    return false
  }

  public allocationRessourcesVide(allocationRessources: EntitéJuridiqueAllocationRessources): boolean {
    return allocationRessources.allocationRessoure.every(
      (row) => row.enveloppe === null && row.sousEnveloppe === null && row.modeDeDélégation === null && row.montantNotifié === null
    );
  }

  private associeLaCouleurDeLArcAuMotifDuAllocationDeRessource(motif: string) {
    return {
      premierPlan: this.couleursDuDoughnutDesAllocationDeRessource[motif].couleurDeLArc,
      secondPlan: this.couleursDuDoughnutDesAllocationDeRessource[motif].couleurDeLArc,
    };
  }

  private associeLaCouleurDuLibelléAuMotifDAbsentéisme(motif: string): string {
    return this.couleursDuDoughnutDesAllocationDeRessource[motif].couleurDuLibellé;
  }

  public allocationDeRessource(annéeEnCours: number): ReactElement {
    if (!annéeEnCours) return this.pasDeAllocationDeRessource;

    const couleursDuDoughnut: CouleurHistogramme[] = [];
    const couleursDesLibelles: string[] = [];

    const valeursAvecMotif = this.allocationRessourcesEnCoursGroubByEnveloppe(annéeEnCours).filter((valeur: any) => valeur.valeur !== 0);
    const treeAllocationRessourcesGroubByEnveloppeSousEnvelopeETMode = this.allocationRessourcesEnCoursGroubByEnveloppeSousEnvelopeETMode(annéeEnCours).filter((valeur: any) => valeur.total !== 0);;
    const transformDataToTranscriptionData = this.transformDataToTranscriptionData(treeAllocationRessourcesGroubByEnveloppeSousEnvelopeETMode);
    const transcriptionDataKeys = transformDataToTranscriptionData.map((item) => item.key);
    const transcriptionDataValues = transformDataToTranscriptionData.map((item) => item.value);

    valeursAvecMotif.forEach((item: AllocationValeursAvecMotif) => {
      couleursDuDoughnut.push(this.associeLaCouleurDeLArcAuMotifDuAllocationDeRessource(item.motif));
      couleursDesLibelles.push(this.associeLaCouleurDuLibelléAuMotifDAbsentéisme(item.motif));
    });

    const valeursDesAllocationDeRessourcePourcentage = valeursAvecMotif.map((item: AllocationValeursAvecMotif) => parseFloat(item.valeur.toFixed(1)));
    const motifsDesAllocationDeRessource = valeursAvecMotif.map((item: AllocationValeursAvecMotif) => item.motif);

    const motifsDesAllocationDeRessourceWithPourcentage = valeursAvecMotif.map(
      (item: AllocationValeursAvecMotif) => `${item.motif} : ${convertFloatToComma(parseFloat(item.valeur.toFixed(1)))}%`
    );

    const listeAnnéesManquantes = annéesManquantes(this.annéesAvecDesAllocationDeRessource);

    return (
      <>
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-1w">
          <div className="fr-col-5">
            <DonutNoCenterText
              couleursDuDoughnut={couleursDuDoughnut}
              couleursLibelle={couleursDesLibelles}
              idDeLaLégende={this.IDENTIFIANT_DE_LA_LÉGENDE_DES_ALLOCATION_RESSOURCES}
              libellés={motifsDesAllocationDeRessourceWithPourcentage}
              title={this.wording.REPARTITION_DES_ENVELOPPES}
              total={1}
              valeurs={valeursDesAllocationDeRessourcePourcentage}
            />
          </div>
          <div className="fr-col-7">
            <DetailsAllocations data={treeAllocationRessourcesGroubByEnveloppeSousEnvelopeETMode} />
          </div>
        </div>
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-5 fr-pt-0">
            <Transcription
              entêteLibellé={this.wording.ALLOCATION_DE_RESSOURCES}
              identifiants={[this.wording.REPARTITION_DES_ENVELOPPES]}
              libellés={motifsDesAllocationDeRessource}
              valeurs={[[...StringFormater.addPercentToValues(valeursDesAllocationDeRessourcePourcentage)]]}
            />
          </div>
          <div className="fr-col-6 fr-pt-0 fr-ml-3w">
            <Transcription
              entêteLibellé={this.wording.ALLOCATION_DE_RESSOURCES}
              identifiants={[this.wording.REPARTITION_DES_SOUS_ENVELOPPES]}
              libellés={transcriptionDataKeys}
              valeurs={[[...transcriptionDataValues]]}
            />
          </div>
        </div>
      </>
    );
  }
}
