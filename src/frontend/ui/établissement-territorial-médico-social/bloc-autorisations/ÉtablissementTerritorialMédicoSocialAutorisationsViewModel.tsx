import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocial } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { CapacitéParActivité } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation";
import { Wording } from "../../../configuration/wording/Wording";
import { CouleurHistogramme, GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../../commun/Tag";

export class ÉtablissementTerritorialMédicoSocialAutorisationsViewModel extends GraphiqueViewModel {
  constructor(private readonly établissementTerritorialAutorisations: ÉtablissementTerritorialMédicoSocial["autorisationsEtCapacités"], wording: Wording) {
    super(wording);
  }

  public get lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées(): boolean {
    return !this.lesAutorisationsSontEllesRenseignées && !this.lesCapacitésSontEllesRenseignées;
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
                              label={`${this.wording.DATE_D_AUTORISATION} : ${
                                datesEtCapacités.dateDAutorisation ? StringFormater.formateLaDate(datesEtCapacités.dateDAutorisation) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.MISE_À_JOUR_AUTORISATION} : ${
                                datesEtCapacités.dateDeMiseÀJourDAutorisation
                                  ? StringFormater.formateLaDate(datesEtCapacités.dateDeMiseÀJourDAutorisation)
                                  : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DERNIÈRE_INSTALLATION} : ${
                                datesEtCapacités.dateDeDernièreInstallation ? StringFormater.formateLaDate(datesEtCapacités.dateDeDernièreInstallation) : "N/A"
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

  public get dateDeMiseÀJourDesAutorisations(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialAutorisations.autorisations.dateMiseÀJourSource);
  }

  public get capacitéParActivités(): ReactElement {
    const [activités, capacités] = this.construisLesCapacitésParActivités();
    const construisLaCouleurDeLaBarreHorizontale = (_valeur: number, libellé: number | string): CouleurHistogramme => {
      return {
        premierPlan: libellé === this.wording.NOMBRE_TOTAL_DE_PLACE ? this.couleurDuFondHistogrammePrimaire : this.couleurDuFondHistogrammeSecondaire,
        secondPlan: this.couleurDuFondHistogrammePrimaire,
      };
    };
    const libellésDesValeurs = Array(capacités.length).fill({ couleur: this.couleurIdentifiant });
    const libellésDesTicks = activités.map((activité) => ({
      tailleDePolice: activité === this.wording.NOMBRE_TOTAL_DE_PLACE ? this.policeGrasse : this.policeNormale,
    }));

    return this.afficheUnHistogrammeHorizontal(
      capacités,
      activités,
      this.construisLesCouleursDeLHistogramme(capacités, activités, construisLaCouleurDeLaBarreHorizontale),
      libellésDesValeurs,
      libellésDesTicks,
      this.wording.ACTIVITÉ,
      this.wording.CAPACITÉ_INSTALLÉE,
      [],
      capacités.length
    );
  }

  public get lesCapacitésSontEllesRenseignées(): boolean {
    return this.établissementTerritorialAutorisations.capacités.capacitéParActivité.length !== 0;
  }

  public get dateDeMiseÀJourDesCapacitésParActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialAutorisations.capacités.dateMiseÀJourSource);
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
