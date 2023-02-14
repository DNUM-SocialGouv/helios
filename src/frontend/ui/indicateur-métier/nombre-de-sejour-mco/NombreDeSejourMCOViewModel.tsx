import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";
import { TableIndicateur } from "../../commun/TableIndicateur/TableIndicateur";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { IndicateurDesSejoursMCO } from "../IndicateurDesSejoursMCO";

export class NombreDeSejourMCOViewModel extends GraphiqueViewModel {
  readonly couleurDuFondHistogrammeVertClair = "#DFFDF7";
  readonly couleurDuFondHistogrammeVertFoncé = "#006A6F";
  readonly couleurDuFondHistogrammeRougeClair = "#FEE9E6";
  readonly couleurDuFondHistogrammeBleuClair = "#DEE5FD";
  readonly couleurDuFondHistogrammeBleuFoncé = "#2F4077";
  readonly couleurDuFondHistogrammeRougeFoncé = "#A94645";
  readonly identifiantDeLaLégendeDesSéjoursMCO = "légende-graphique-sanitaire-journées-séjours-mco";

  constructor(private readonly établissementTerritorialSanitaireActivités: ÉtablissementTerritorialSanitaire["activités"], wording: Wording) {
    super(wording);
  }

  public get nombreDeSéjoursMCOSontIlsRenseignés(): boolean {
    return this.établissementTerritorialSanitaireActivités.some(
      (activité: ÉtablissementTerritorialSanitaireActivité) =>
        activité["nombreSéjoursPartielsMédecine"].value !== null ||
        activité["nombreSéjoursCompletsMédecine"].value !== null ||
        activité["nombreSéjoursPartielsChirurgie"].value !== null ||
        activité["nombreSéjoursCompletsChirurgie"].value !== null ||
        activité["nombreSéjoursPartielsObstétrique"].value !== null ||
        activité["nombreSéjoursCompletsObstétrique"].value !== null
    );
  }

  public get nombreDeSéjoursMédecineChirurgieObstétrique(): ReactElement {
    const [nombreDeSéjours, années] = this.construisLesSéjoursMCOParAnnée();

    return this.afficheLHistogrammeDesSéjoursMCO(nombreDeSéjours, années);
  }

  public get dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireActivités[0].nombreSéjoursCompletsMédecine.dateMiseÀJourSource);
  }

  private construisLesSéjoursMCOParAnnée(): [IndicateurDesSejoursMCO, number[]] {
    const nombreDeSéjours: IndicateurDesSejoursMCO = {
      nombreSéjoursCompletsChirurgie: [],
      nombreSéjoursCompletsMédecine: [],
      nombreSéjoursCompletsObstétrique: [],
      nombreSéjoursPartielsChirurgie: [],
      nombreSéjoursPartielsMédecine: [],
      nombreSéjoursPartielsObstétrique: [],
    };
    const années: number[] = [];

    this.établissementTerritorialSanitaireActivités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
      années.push(activité.année);
      nombreDeSéjours.nombreSéjoursCompletsChirurgie.push({
        x: activité.année,
        y: activité.nombreSéjoursCompletsChirurgie.value,
      });
      nombreDeSéjours.nombreSéjoursCompletsMédecine.push({
        x: activité.année,
        y: activité.nombreSéjoursCompletsMédecine.value,
      });
      nombreDeSéjours.nombreSéjoursCompletsObstétrique.push({
        x: activité.année,
        y: activité.nombreSéjoursCompletsObstétrique.value,
      });
      nombreDeSéjours.nombreSéjoursPartielsChirurgie.push({
        x: activité.année,
        y: activité.nombreSéjoursPartielsChirurgie.value,
      });
      nombreDeSéjours.nombreSéjoursPartielsMédecine.push({
        x: activité.année,
        y: activité.nombreSéjoursPartielsMédecine.value,
      });
      nombreDeSéjours.nombreSéjoursPartielsObstétrique.push({
        x: activité.année,
        y: activité.nombreSéjoursPartielsObstétrique.value,
      });
    });
    return [nombreDeSéjours, années];
  }

  private afficheLHistogrammeDesSéjoursMCO(nombreDeSéjours: IndicateurDesSejoursMCO, années: number[]): ReactElement {
    const data = {
      datasets: [
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuClair,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsMédecine,
          label: this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuFoncé,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsMédecine,
          label: this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertClair,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsChirurgie,
          label: this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
          stack: "Stack 2",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertFoncé,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsChirurgie,
          label: this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
          stack: "Stack 2",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeClair,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsObstétrique,
          label: this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
          stack: "Stack 3",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeFoncé,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsObstétrique,
          label: this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
          stack: "Stack 3",
        },
      ],
      labels: années,
    };

    const options = this.optionsHistogrammeÀBandes(this.identifiantDeLaLégendeDesSéjoursMCO, this.tooltipSéjoursMCO);

    return (
      <>
        <Bar data={data} options={options} />
        <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={this.identifiantDeLaLégendeDesSéjoursMCO} />
        <TableIndicateur
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[
            this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
            this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
            this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
            this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
            this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
            this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
          ]}
          libellés={années}
          valeurs={[
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsMédecine),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsMédecine),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsChirurgie),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsChirurgie),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsObstétrique),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsObstétrique),
          ]}
        />
      </>
    );
  }

  // TODO this is used in EtablismentTerritorialSanitaireActiviteVM
  private valeursDesNombresDeSéjours(nombresSéjours: { x: number; y: number | null }[]): (string | null)[] {
    return nombresSéjours.map((nombreSéjour) => {
      return nombreSéjour.y ? nombreSéjour.y.toLocaleString("fr") : null;
    });
  }

  private tooltipSéjoursMCO(wording: Wording) {
    return function (context: any) {
      const label = `${context.dataset.label} : ${context.parsed.y.toLocaleString("fr")}`;

      if (context.datasetIndex <= 1) {
        const nombreSéjoursHospitalisationPartielleMédecine = context.parsed._stacks.y["0"];
        const nombreSéjoursHospitalisationComplèteMédecine = context.parsed._stacks.y["1"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_MÉDECINE} : ${(
            nombreSéjoursHospitalisationPartielleMédecine + nombreSéjoursHospitalisationComplèteMédecine
          ).toLocaleString("fr")}`,
        ];
      }
      if (context.datasetIndex === 2 || context.datasetIndex === 3) {
        const nombreSéjoursHospitalisationPartielleChirurgie = context.parsed._stacks.y["2"];
        const nombreSéjoursHospitalisationComplèteChirurgie = context.parsed._stacks.y["3"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_CHIRURGIE} : ${(
            nombreSéjoursHospitalisationPartielleChirurgie + nombreSéjoursHospitalisationComplèteChirurgie
          ).toLocaleString("fr")}`,
        ];
      }
      if (context.datasetIndex === 4 || context.datasetIndex === 5) {
        const nombreSéjoursHospitalisationPartielleObstétrique = context.parsed._stacks.y["4"];
        const nombreSéjoursHospitalisationComplèteObstétrique = context.parsed._stacks.y["5"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_OBSTÉTRIQUE} : ${(
            nombreSéjoursHospitalisationPartielleObstétrique + nombreSéjoursHospitalisationComplèteObstétrique
          ).toLocaleString("fr")}`,
        ];
      }
      return label;
    };
  }
}
