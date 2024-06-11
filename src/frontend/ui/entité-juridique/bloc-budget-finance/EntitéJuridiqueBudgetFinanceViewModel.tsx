import { ReactElement } from "react";

import {
  AllocationValeursAvecMotif,
  DataRowEntitéJuridiqueAllocationRessources,
  EntitéJuridiqueAllocationRessources,
  IEnveloppe,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAllocationRessources";
import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import {
  couleurDuFondHistogrammeBleuFoncé,
  couleurDuFondHistogrammeSecondaire,
  CouleurHistogramme,
  couleurIdentifiant,
  noir,
} from "../../commun/Graphique/couleursGraphique";
import { couleurDesArcsDuDonut, DonutNoCenterText } from "../../commun/Graphique/DonutNoCenterText";
import { HistogrammeData } from "../../commun/Graphique/HistogrammesHorizontaux";
import { MiseEnExergue } from "../../commun/MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../../commun/StringFormater";
import { Transcription } from "../../commun/Transcription/Transcription";
import { ResultatNetComptableViewModel } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptableViewModel";
import { TauxDeCafViewModel } from "../../indicateur-métier/taux-de-caf/TauxDeCafViewModel";
import { DetailsAllocations } from "./allocation-ressources/SousEnveloppes/DetailsAllocations";
import { RatioDependanceFinanciereViewModel } from "./ratio-dependance-financiere/RatioDependanceFinanciereViewModel";

export class EntitéJuridiqueBudgetFinanceViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  private allocationRessources: EntitéJuridiqueAllocationRessources[];
  public resultatNetComptable: ResultatNetComptableViewModel;
  private wording: Wording;
  public NOMBRE_ANNEES = 5;
  public ratioDependanceFinanciere: RatioDependanceFinanciereViewModel;
  public tauxDeCafViewModel: TauxDeCafViewModel;
  private readonly couleursDuDoughnutDesAllocationDeRessource: Record<string, { couleurDeLArc: string; couleurDuLibellé: string }>;
  private readonly annéesAvecDesAllocationDeRessource: number[];
  private readonly IDENTIFIANT_DE_LA_LÉGENDE_DES_ALLOCATION_RESSOURCES = "légende-graphique-entite-juridique-allocation-ressources";

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], allocationRessources: EntitéJuridiqueAllocationRessources[], wording: Wording) {
    this.wording = wording;
    this.budgetEtFinance = budgetFinance;
    this.allocationRessources = allocationRessources;
    this.resultatNetComptable = new ResultatNetComptableViewModel(budgetFinance);
    this.ratioDependanceFinanciere = new RatioDependanceFinanciereViewModel(budgetFinance);
    this.tauxDeCafViewModel = TauxDeCafViewModel.fromBudgetFinanceEntiteJuridique(budgetFinance, wording);

    this.couleursDuDoughnutDesAllocationDeRessource = {
      [this.wording.DAF]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[0], couleurDuLibellé: couleurIdentifiant },
      [this.wording.DOTATIONS_DE_SOINS_USLD]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[1], couleurDuLibellé: couleurIdentifiant },
      [this.wording.FIR]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[2], couleurDuLibellé: noir },
      [this.wording.FORFAITS]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[3], couleurDuLibellé: noir },
      [this.wording.MIGAC]: { couleurDeLArc: couleurDesArcsDuDonut.opaque[4], couleurDuLibellé: noir },
    };

    this.annéesAvecDesAllocationDeRessource = this.lesAnnéesEffectivesDuAllocationRessources();
  }

  public get annéeInitiale() {
    const years = this.budgetEtFinance.filter((budgetEtFinance) => !this.compteResultatVide(budgetEtFinance)).map((budgetFinance) => budgetFinance.année);
    const anneesTriees = years.sort((année1, année2) => année2 - année1);
    return anneesTriees[0];
    //return this.budgetEtFinance[this.budgetEtFinance.length - 1]?.année;
  }

  budgetEtFinanceEnCours(annéeEnCours: number): EntitéJuridiqueBudgetFinance {
    return this.budgetEtFinance.find((budgetEtFinance) => budgetEtFinance.année === annéeEnCours) as EntitéJuridiqueBudgetFinance;
  }

  public get lesDonnéesBudgetEtFinanceNeSontPasRenseignées() {
    return (
      (!this.budgetEtFinance && !this.allocationRessources) ||
      (this.budgetEtFinance.length === 0 && this.allocationRessources.length) ||
      (this.compteDeResultatVide() &&
        this.allocationDeRessourcesVide() &&
        !this.resultatNetComptable.auMoinsUnResultatNetRenseigné() &&
        !this.ratioDependanceFinanciere.auMoinsUnRatioRenseigné() &&
        !this.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné)
    );
  }

  public get lesDonnéesBudgetairePasRenseignee(): string[] {
    const nonRenseignees = [];
    if (this.compteDeResultatVide()) nonRenseignees.push(this.wording.COMPTE_DE_RÉSULTAT_CF);
    if (this.allocationDeRessourcesVide()) nonRenseignees.push(this.wording.ALLOCATION_DE_RESSOURCES);
    if (!this.resultatNetComptable.auMoinsUnResultatNetRenseigné()) nonRenseignees.push(this.wording.RÉSULTAT_NET_COMPTABLE);
    if (!this.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné) nonRenseignees.push(this.wording.TAUX_DE_CAF);
    if (!this.ratioDependanceFinanciere.auMoinsUnRatioRenseigné()) nonRenseignees.push(this.wording.RATIO_DEPENDANCE_FINANCIERE);
    return nonRenseignees;
  }

  public lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat(), this.NOMBRE_ANNEES);
  }

  public lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    return this.budgetEtFinance.filter((budgetEtFinance) => !this.compteResultatVide(budgetEtFinance)).map((budgetFinance) => budgetFinance.année);
  }

  public compteDeResultatVide() {
    return this.budgetEtFinance.every(this.compteResultatVide);
  }

  public get compteDeResultatEstIlAutorisé() {
    return this.budgetEtFinance.every(this.compteResultatAutorisé);
  }

  private compteResultatVide(budgetFinance: EntitéJuridiqueBudgetFinance): boolean {
    return (
      budgetFinance.depensesTitreIPrincipales === null &&
      budgetFinance.depensesTitreIIPrincipales === null &&
      budgetFinance.depensesTitreIIIPrincipales === null &&
      budgetFinance.depensesTitreIVPrincipales === null &&
      budgetFinance.recettesTitreIPrincipales === null &&
      budgetFinance.recettesTitreIIPrincipales === null &&
      budgetFinance.recettesTitreIIIPrincipales === null &&
      budgetFinance.recettesTitreIGlobal === null &&
      budgetFinance.recettesTitreIIGlobal === null &&
      budgetFinance.recettesTitreIIIGlobal === null &&
      budgetFinance.recettesTitreIVGlobal === null &&
      budgetFinance.depensesTitreIGlobal === null &&
      budgetFinance.depensesTitreIIGlobal === null &&
      budgetFinance.depensesTitreIIIGlobal === null &&
      budgetFinance.depensesTitreIVGlobal === null
    );
  }

  private compteResultatAutorisé(budgetFinance: EntitéJuridiqueBudgetFinance): boolean {
    return (
      budgetFinance.depensesTitreIPrincipales !== "" &&
      budgetFinance.depensesTitreIIPrincipales !== "" &&
      budgetFinance.depensesTitreIIIPrincipales !== "" &&
      budgetFinance.depensesTitreIVPrincipales !== "" &&
      budgetFinance.recettesTitreIPrincipales !== "" &&
      budgetFinance.recettesTitreIIPrincipales !== "" &&
      budgetFinance.recettesTitreIIIPrincipales !== "" &&
      budgetFinance.recettesTitreIGlobal !== "" &&
      budgetFinance.recettesTitreIIGlobal !== "" &&
      budgetFinance.recettesTitreIIIGlobal !== "" &&
      budgetFinance.recettesTitreIVGlobal !== "" &&
      budgetFinance.depensesTitreIGlobal !== "" &&
      budgetFinance.depensesTitreIIGlobal !== "" &&
      budgetFinance.depensesTitreIIIGlobal !== "" &&
      budgetFinance.depensesTitreIVGlobal !== ""
    );
  }

  allocationRessourcesEnCours(annéeEnCours: number): EntitéJuridiqueAllocationRessources {
    return this.allocationRessources.find((allocationRessources) => allocationRessources.année === annéeEnCours) as EntitéJuridiqueAllocationRessources;
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
    const result = Object.keys(groupedData).map((enveloppe) => {
      const totalEnveloppe = groupedData[enveloppe].total;
      const pourcentageEnveloppe = ((totalEnveloppe / totalGeneral) * 100).toFixed(0);
      const sousEnveloppes = groupedData[enveloppe].sousEnveloppes;
  
      // Trier les sous-enveloppes par pourcentage décroissant
      const sousEnveloppesResult = Object.keys(sousEnveloppes).map((sousEnveloppe) => {
        const totalSousEnveloppe = sousEnveloppes[sousEnveloppe].total;
        const pourcentageSousEnveloppe = ((totalSousEnveloppe / totalEnveloppe) * 100).toFixed(0);
        const modesDeDélégation = sousEnveloppes[sousEnveloppe].modesDeDélégation;
  
        // Trier les modes de délégation par pourcentage décroissant
        const modesDeDélégationResult = Object.keys(modesDeDélégation).map((modeDeDélégation) => {
          const montantNotifié = modesDeDélégation[modeDeDélégation];
          const pourcentageModeDeDélégation = ((montantNotifié / totalSousEnveloppe) * 100).toFixed(0);
          return { modeDeDélégation, montantNotifié, pourcentage: pourcentageModeDeDélégation };
        }).sort((a, b) => parseFloat(b.pourcentage) - parseFloat(a.pourcentage)); // Tri par pourcentage décroissant
  
        return { sousEnveloppe, total: totalSousEnveloppe, pourcentage: pourcentageSousEnveloppe, modesDeDélégation: modesDeDélégationResult };
      }).sort((a, b) => parseFloat(b.pourcentage) - parseFloat(a.pourcentage)); // Tri par pourcentage décroissant
  
      return { enveloppe, total: totalEnveloppe, pourcentage: pourcentageEnveloppe, sousEnveloppes: sousEnveloppesResult };
    }).sort((a, b) => parseFloat(b.pourcentage) - parseFloat(a.pourcentage)); // Tri par pourcentage décroissant
  
    return result;
  }

  transformDataToTranscriptionData(data : IEnveloppe[]) {
    const result: { key: string; value: any; }[] = [];
  
    data.forEach(enveloppeItem => {
      // Ajouter l'objet pour l'enveloppe principale
      result.push({ key: `Enveloppe ${enveloppeItem.enveloppe}`, value: enveloppeItem.total + ' €' });
  
      // Traiter les sous-enveloppes
      enveloppeItem.sousEnveloppes.forEach(sousEnveloppeItem => {
        result.push({ key: `Sous Enveloppe ${sousEnveloppeItem.sousEnveloppe}`, value: `${sousEnveloppeItem.total} € (${sousEnveloppeItem.pourcentage}%)` });
  
        // Traiter les modes de délégation
        sousEnveloppeItem.modesDeDélégation.forEach(modeDeDélégationItem => {
          result.push({ key: `${modeDeDélégationItem.modeDeDélégation}`, value: `${modeDeDélégationItem.montantNotifié} € (${modeDeDélégationItem.pourcentage}%)` });
        });
      });
    });
  
    return result;
  }
  
  allocationRessourcesEnCoursGroubByEnveloppe(annéeEnCours: number): any {
    const dataAllocationRessources = this.allocationRessourcesEnCours(annéeEnCours);
    return this.allocationRessourcesGroubByEnveloppe(dataAllocationRessources.data);
  }

  allocationRessourcesEnCoursGroubByEnveloppeSousEnvelopeETMode(annéeEnCours: number): any {
    const dataAllocationRessources = this.allocationRessourcesEnCours(annéeEnCours);
    return this.allocationRessourcesGroubByEnveloppeSousEnvelopeETMode(dataAllocationRessources.data);
  }

  public lesAnnéesEffectivesDuAllocationRessources(): number[] {
    return this.allocationRessources
      .filter((allocationRessources) => !this.allocationRessourcesVide(allocationRessources))
      .map((allocationRessources) => allocationRessources.année);
  }

  public lesAnnéesManquantesDuAllocationRessources(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuAllocationRessources(), this.NOMBRE_ANNEES);
  }

  public allocationDeRessourcesVide() {
    return this.allocationRessources.every(this.allocationRessourcesVide);
  }

  public get allocationRessourcesEstIlAutorisé() {
    return this.allocationRessources.every(this.allocationRessourcesAutorisé);
  }

  private allocationRessourcesVide(allocationRessources: EntitéJuridiqueAllocationRessources): boolean {
    return allocationRessources.data.every(
      (row) => row.enveloppe === null && row.sousEnveloppe === null && row.modeDeDélégation === null && row.montantNotifié === null
    );
  }

  private allocationRessourcesAutorisé(allocationRessources: EntitéJuridiqueAllocationRessources): boolean {
    return allocationRessources.data.every(
      (row) => row.enveloppe !== "" && row.sousEnveloppe !== "" && row.modeDeDélégation !== "" && row.montantNotifié !== ""
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

  public allocationDeRessource(annéeEnCours: number): ReactElement {
    if (!annéeEnCours) return this.pasDeAllocationDeRessource;

    const couleursDuDoughnut: CouleurHistogramme[] = [];
    const couleursDesLibelles: string[] = [];

    const valeursAvecMotif = this.allocationRessourcesEnCoursGroubByEnveloppe(annéeEnCours);
    const treeAllocationRessourcesGroubByEnveloppeSousEnvelopeETMode = this.allocationRessourcesEnCoursGroubByEnveloppeSousEnvelopeETMode(annéeEnCours);

     
    const transformDataToTranscriptionData = this.transformDataToTranscriptionData(treeAllocationRessourcesGroubByEnveloppeSousEnvelopeETMode);
    const transcriptionDataKeys = transformDataToTranscriptionData.map((item) => item.key)
    const transcriptionDataValues = transformDataToTranscriptionData.map((item) => item.value)

    valeursAvecMotif.forEach((item: AllocationValeursAvecMotif) => {
      couleursDuDoughnut.push(this.associeLaCouleurDeLArcAuMotifDuAllocationDeRessource(item.motif));
      couleursDesLibelles.push(this.associeLaCouleurDuLibelléAuMotifDAbsentéisme(item.motif));
    });

    const valeursDesAllocationDeRessource = valeursAvecMotif.map((item: AllocationValeursAvecMotif) => Math.floor(item.valeur));
    const valeursDesAllocationDeRessourcePourcentage = valeursAvecMotif.map((item: AllocationValeursAvecMotif) => parseFloat(item.valeur.toFixed(1)));

    
    const motifsDesAllocationDeRessource = valeursAvecMotif.map((item: AllocationValeursAvecMotif) => item.motif);

    const motifsDesAllocationDeRessourceWithPourcentage = valeursAvecMotif.map(
      (item: AllocationValeursAvecMotif) => `${item.motif}  (${parseFloat(item.valeur.toFixed(1))}%)`
    );

    const listeAnnéesManquantes = annéesManquantes(this.annéesAvecDesAllocationDeRessource);
 
    return (
      <>
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
          <div className="fr-col-5">
            <DonutNoCenterText
              couleursDuDoughnut={couleursDuDoughnut}
              couleursLibelle={couleursDesLibelles}
              idDeLaLégende={this.IDENTIFIANT_DE_LA_LÉGENDE_DES_ALLOCATION_RESSOURCES}
              libellés={motifsDesAllocationDeRessourceWithPourcentage}
              texteCentral=""
              title={this.wording.REPARTITION_DES_ENVELOPPES}
              total={1}
              valeurs={valeursDesAllocationDeRessource}
            />
          </div>
          <div className="fr-col-5">
            <DetailsAllocations data={treeAllocationRessourcesGroubByEnveloppeSousEnvelopeETMode} />
          </div>
        </div>
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}

        <Transcription
          entêteLibellé={this.wording.ALLOCATION_DE_RESSOURCES}
          identifiants={[this.wording.REPARTITION_DES_ENVELOPPES]}
          libellés={motifsDesAllocationDeRessource}
          valeurs={[ [...StringFormater.addPercentToValues(valeursDesAllocationDeRessourcePourcentage)] ]}
        />

      <Transcription
          entêteLibellé={this.wording.ALLOCATION_DE_RESSOURCES}
          identifiants={[this.wording.REPARTITION_DES_SOUS_ENVELOPPES]}
          libellés={transcriptionDataKeys}
          valeurs={[ [... transcriptionDataValues] ]}
        />

      </>
    );
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.budgetEtFinance[0]?.dateMiseÀJourSource as string);
  }

  public get compteResultatEstIlAutorisé(): boolean {
    return true;
  }

  public dataGraphiqueCharges(budget: EntitéJuridiqueBudgetFinance): HistogrammeData {
    const depensesGlobales = [
      budget.totalDepensesGlobal,
      budget?.depensesTitreIGlobal,
      budget?.depensesTitreIIGlobal,
      budget?.depensesTitreIIIGlobal,
      budget?.depensesTitreIVGlobal,
    ]
      .map(Number)
      .map(Math.round)
      .map(Math.abs);
    const depensesPrincipales = [
      budget.totalDepensesPrincipales,
      budget?.depensesTitreIPrincipales,
      budget?.depensesTitreIIPrincipales,
      budget?.depensesTitreIIIPrincipales,
      budget?.depensesTitreIVPrincipales,
    ]
      .map(Number)
      .map(Math.round)
      .map(Math.abs);
    const depensesAnnexes = [
      budget.totalDepensesAnnexe,
      budget?.depensesTitreIAnnexe,
      budget?.depensesTitreIIAnnexe,
      budget?.depensesTitreIIIAnnexe,
      budget?.depensesTitreIVAnnexe,
    ]
      .map(Number)
      .map(Math.round)
      .map(Math.abs);
    return new HistogrammeData(
      this.wording.CHARGES,
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      depensesGlobales,
      [
        {
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
          data: depensesPrincipales,
          // isError: depensesPrincipales.map((depense) => depense > 0),
          label: this.wording.CHARGES_PRINCIPALES,
        },
        {
          label: this.wording.CHARGES_ANNEXES,
          data: depensesAnnexes,
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
          // isError: depensesAnnexes.map((depense) => depense > 0),
        },
      ],
      StringFormater.formatInEuro
    );
  }

  public dataGraphiqueProduits(budget: EntitéJuridiqueBudgetFinance): HistogrammeData {
    const produitsPrincipaux = [
      budget.totalRecettesPrincipales,
      budget?.recettesTitreIPrincipales,
      budget?.recettesTitreIIPrincipales,
      budget?.recettesTitreIIIPrincipales,
      0,
    ]
      .map(Number)
      .map(Math.round);
    const produitsGlobaux = [
      budget.totalRecettesGlobal,
      budget?.recettesTitreIGlobal,
      budget?.recettesTitreIIGlobal,
      budget?.recettesTitreIIIGlobal,
      budget?.recettesTitreIVGlobal,
    ]
      .map(Number)
      .map(Math.round);
    const produitsAnnexes = [
      budget.totalRecettesAnnexe,
      budget?.recettesTitreIAnnexe,
      budget?.recettesTitreIIAnnexe,
      budget?.recettesTitreIIIAnnexe,
      budget?.recettesTitreIVAnnexe,
    ]
      .map(Number)
      .map(Math.round);
    return new HistogrammeData(
      this.wording.PRODUITS,
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      produitsGlobaux,
      [
        {
          label: this.wording.PRODUITS_PRINCIPAUX,
          data: produitsPrincipaux,
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
          isError: produitsPrincipaux.map((depense) => depense < 0),
        },
        {
          label: this.wording.PRODUITS_ANNEXES,
          data: produitsAnnexes,
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
          isError: produitsAnnexes.map((depense) => depense < 0),
        },
      ],
      StringFormater.formatInEuro
    );
  }

  private getBackgroundColorBudgetSecondaire() {
    return ["#FA794A", "#FB9175", "#FB9175", "#FB9175", "#FB9175"];
  }

  private getBackgroundColorBudgetPrincipal() {
    return [
      couleurDuFondHistogrammeBleuFoncé,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
    ];
  }

  get légendeChart(): string[] {
    return [this.wording.BUDGET_PRINCIPAL, this.wording.BUDGET_ANNEXE];
  }

  public get lesDonnéesBudgetairePasAutorisés(): string[] {
    const nonAutorisés = [];
    if (!this.compteDeResultatEstIlAutorisé) nonAutorisés.push(this.wording.COMPTE_DE_RÉSULTAT_CF);
    if (!this.allocationRessourcesAutorisé) nonAutorisés.push(this.wording.ALLOCATION_DE_RESSOURCES);
    if (!this.resultatNetComptable.resultatNetComptableEstIlAutorisé) nonAutorisés.push(this.wording.RÉSULTAT_NET_COMPTABLE);
    if (!this.tauxDeCafViewModel.leTauxDeCafEstIlAutorisé) nonAutorisés.push(this.wording.TAUX_DE_CAF);
    if (!this.ratioDependanceFinanciere.ratioDependanceFinanciereEstIlAutorisé) nonAutorisés.push(this.wording.RATIO_DEPENDANCE_FINANCIERE);
    return nonAutorisés;
  }
}
