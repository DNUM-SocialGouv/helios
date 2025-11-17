import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocial } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { CapacitéParActivité } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { StringFormater } from "../../commun/StringFormater";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../../commun/Tag";

export class ÉtablissementTerritorialMédicoSocialAutorisationsViewModel {
  constructor(
    private readonly établissementTerritorialAutorisations: ÉtablissementTerritorialMédicoSocial["autorisationsEtCapacités"],
    private wording: Wording
  ) { }

  public get lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées(): boolean {
    return !this.lesAutorisationsSontEllesRenseignées && !this.lesCapacitésSontEllesRenseignées;
  }

  public get lesDonnéesAutorisationEtCapacitéPasRenseignees(): string[] {
    const nonRenseignees = [];
    if (!this.lesCapacitésSontEllesRenseignées) nonRenseignees.push(this.wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS);
    if (!this.lesAutorisationsSontEllesRenseignées) nonRenseignees.push(this.wording.AUTORISATIONS_MS);
    return nonRenseignees;
  }

  public get lesDonnéesAutorisationEtCapacitéPasAutorisés(): string[] {
    const nonAutorisés = [];
    if (!this.lesCapacitésSontEllesAutorisées) nonAutorisés.push(this.wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS);
    if (!this.lesAutorisationsSontEllesAutorisées) nonAutorisés.push(this.wording.AUTORISATIONS_MS);
    return nonAutorisés;
  }

  public get autorisations(): ReactElement {
    const autorisationsDeLÉtablissement = this.établissementTerritorialAutorisations.autorisations;

    return (
      <ul aria-label="disciplines" className="autorisations">
        {autorisationsDeLÉtablissement.disciplines.map((discipline) => (
          <li key={`discipline-${discipline.code}`}>
            <TagCliquable for={`accordion-${discipline.code}`} titre={`${discipline.libellé} [${discipline.code}]`} />
            <ul className="fr-collapse niveau1" id={`accordion-${discipline.code}`}>
              {discipline.activités.map((activité) => (
                <li key={`activité-${activité.code}`}>
                  <TagCliquable for={`accordion-${discipline.code}-${activité.code}`} texteGras={false} titre={`${activité.libellé} [${activité.code}]`} />
                  <ul className="fr-collapse niveau2" id={`accordion-${discipline.code}-${activité.code}`}>
                    {activité.clientèles.map((clientèle) => {
                      const datesEtCapacités = clientèle.datesEtCapacités;
                      return (
                        <li key={`clientèle-${clientèle.code}`}>
                          <TagGroup label="dates-et-capacités">
                            <Tag label={`${clientèle.libellé} [${clientèle.code}]`} size={TAG_SIZE.SM} withArrow />
                            <Tag
                              label={`${this.wording.DATE_D_AUTORISATION} : ${datesEtCapacités.dateDAutorisation ? StringFormater.formatDate(datesEtCapacités.dateDAutorisation) : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.MISE_À_JOUR_AUTORISATION} : ${datesEtCapacités.dateDeMiseÀJourDAutorisation ? StringFormater.formatDate(datesEtCapacités.dateDeMiseÀJourDAutorisation) : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DERNIÈRE_INSTALLATION} : ${datesEtCapacités.dateDeDernièreInstallation ? StringFormater.formatDate(datesEtCapacités.dateDeDernièreInstallation) : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag label={`${this.wording.CAPACITÉ_AUTORISÉE} : ${datesEtCapacités.capacitéAutoriséeTotale ?? "N/A"}`} size={TAG_SIZE.SM} />
                            <Tag label={`${this.wording.CAPACITÉ_INSTALLÉE} : ${datesEtCapacités.capacitéInstalléeTotale ?? "N/A"}`} size={TAG_SIZE.SM} />
                          </TagGroup>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  public get lesAutorisationsSontEllesRenseignées(): boolean {
    return this.établissementTerritorialAutorisations.autorisations.disciplines.length !== 0;
  }

  public get lesAutorisationsSontEllesAutorisées(): boolean {
    return this.établissementTerritorialAutorisations.autorisations.dateMiseÀJourSource !== '';
  }

  public get lesCapacitésSontEllesAutorisées(): boolean {
    return this.établissementTerritorialAutorisations.capacités.dateMiseÀJourSource !== '';
  }

  public get dateDeMiseÀJourDesAutorisations(): string {
    return StringFormater.formatDate(this.établissementTerritorialAutorisations.autorisations.dateMiseÀJourSource);
  }

  public capacitéParActivitésHistogramme(etabFiness: string, etabTitle: string): ReactElement {
    const [activités, capacités] = this.construisLesCapacitésParActivités();

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={activités.map((activité: string) => ({
          premierPlan: activité === this.wording.NOMBRE_TOTAL_DE_PLACE ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire,
        }))}
        entêteLibellé={this.wording.ACTIVITÉ}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={this.wording.CAPACITÉ_INSTALLÉE}
        libellés={activités}
        libellésDeValeursManquantes={[]}
        nomGraph={this.wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
        nombreDeLibelléTotal={capacités.length}
        valeurs={capacités}
      />
    );
  }

  public get lesCapacitésSontEllesRenseignées(): boolean {
    return this.établissementTerritorialAutorisations.capacités.capacitéParActivité.length !== 0;
  }

  public get dateDeMiseÀJourDesCapacitésParActivités(): string {
    return StringFormater.formatDate(this.établissementTerritorialAutorisations.capacités.dateMiseÀJourSource);
  }

  private construisLesCapacitésParActivités(): [string[], number[]] {
    const activités: string[] = [];
    const capacités: number[] = [];
    let capacitéTotale = 0;

    this.établissementTerritorialAutorisations.capacités.capacitéParActivité.forEach((activité: CapacitéParActivité) => {
      activités.push(activité.libellé);
      capacités.push(activité.capacité);
      capacitéTotale += activité.capacité;
    });

    activités.splice(0, 0, this.wording.NOMBRE_TOTAL_DE_PLACE);
    capacités.splice(0, 0, capacitéTotale);
    return [activités, capacités];
  }
}
