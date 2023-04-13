import { ReactElement } from "react";

import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../../commun/Tag";
import { GraphiqueCapacitésParActivitéViewModel } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";
import stylesBlocAutorisationsEtCapacités from "./BlocAutorisationEtCapacitéSanitaire.module.css";

export class EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel extends GraphiqueViewModel {
  public graphiqueCapacitésParActivitéViewModel: GraphiqueCapacitésParActivitéViewModel;

  constructor(
    private readonly établissementTerritorialSanitaireAutorisations: ÉtablissementTerritorialSanitaire["autorisationsEtCapacités"],
    wording: Wording
  ) {
    super(wording);
    this.graphiqueCapacitésParActivitéViewModel = new GraphiqueCapacitésParActivitéViewModel(établissementTerritorialSanitaireAutorisations.capacités, wording);
  }

  public get lesDonnéesAutorisationEtCapacitéNeSontPasRenseignées(): boolean {
    return (
      !this.graphiqueCapacitésParActivitéViewModel.lesCapacitésParActivitésSontEllesRenseignées &&
      !this.lesAutorisationsSontEllesRenseignées &&
      !this.lesAutresActivitésSontEllesRenseignées &&
      !this.lesReconnaissancesContractuellesSontEllesRenseignées &&
      !this.lesÉquipementsMatérielsLourdsSontIlsRenseignés
    );
  }

  public get autorisations(): ReactElement {
    const autorisationsDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.autorisations;

    return (
      <ul aria-label="activités" className="autorisations">
        {autorisationsDeLÉtablissement.activités.map((activité) => (
          <li key={`activité-${activité.code}`}>
            <TagCliquable for={`autorisations-accordion-${activité.code}`} titre={`${activité.libellé} [${activité.code}]`} />
            <ul className="fr-collapse niveau1" id={`autorisations-accordion-${activité.code}`}>
              {activité.modalités.map((modalité) => (
                <li key={`modalité-${modalité.code}`}>
                  <TagCliquable
                    for={`autorisations-accordion-${activité.code}-${modalité.code}`}
                    texteGras={false}
                    titre={`${modalité.libellé} [${modalité.code}]`}
                  />
                  <ul className="fr-collapse niveau2" id={`autorisations-accordion-${activité.code}-${modalité.code}`}>
                    {modalité.formes.map((forme) => {
                      const autorisationSanitaire = forme.autorisationSanitaire;
                      return (
                        <li key={`forme-${forme.code}`}>
                          <TagGroup label="autorisations">
                            <Tag label={`${forme.libellé} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
                            <Tag
                              label={`${this.wording.NUMÉRO_ARHGOS} : ${autorisationSanitaire.numéroArhgos ? autorisationSanitaire.numéroArhgos : "N/A"}`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${
                                autorisationSanitaire.dateDeMiseEnOeuvre ? StringFormater.formatDate(autorisationSanitaire.dateDeMiseEnOeuvre) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_FIN} : ${
                                autorisationSanitaire.dateDeFin ? StringFormater.formatDate(autorisationSanitaire.dateDeFin) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_D_AUTORISATION} : ${
                                autorisationSanitaire.dateDAutorisation ? StringFormater.formatDate(autorisationSanitaire.dateDAutorisation) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
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
    return this.établissementTerritorialSanitaireAutorisations.autorisations.activités.length !== 0;
  }

  public get dateDeMiseÀJourDesAutorisations(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireAutorisations.autorisations.dateMiseÀJourSource);
  }

  public get autresActivités(): ReactElement {
    const autresActivitésDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.autresActivités;

    return (
      <ul aria-label="activités" className={`${stylesBlocAutorisationsEtCapacités["liste-activités"]}`}>
        {autresActivitésDeLÉtablissement.activités.map((activité) => (
          <li key={`activité-${activité.code}`}>
            <TagCliquable for={`autresActivités-accordion-${activité.code}`} titre={`${activité.libellé} [${activité.code}]`} />
            <ul className=" fr-collapse niveau1" id={`autresActivités-accordion-${activité.code}`}>
              {activité.modalités.map((modalité) => (
                <li key={`modalité-${modalité.code}`}>
                  <TagCliquable
                    for={`autresActivités-accordion-${activité.code}-${modalité.code}`}
                    texteGras={false}
                    titre={`${modalité.libellé} [${modalité.code}]`}
                  />
                  <ul className="fr-collapse niveau2" id={`autresActivités-accordion-${activité.code}-${modalité.code}`}>
                    {modalité.formes.map((forme) => {
                      const autreActivitéSanitaire = forme.autreActivitéSanitaire;
                      return (
                        <li key={`forme-${forme.code}`}>
                          <TagGroup label="autre-activité">
                            <Tag label={`${forme.libellé} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
                            <Tag
                              label={`${this.wording.DATE_D_AUTORISATION} : ${
                                autreActivitéSanitaire.dateDAutorisation ? StringFormater.formatDate(autreActivitéSanitaire.dateDAutorisation) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${
                                autreActivitéSanitaire.dateDeMiseEnOeuvre ? StringFormater.formatDate(autreActivitéSanitaire.dateDeMiseEnOeuvre) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_FIN} : ${
                                autreActivitéSanitaire.dateDeFin ? StringFormater.formatDate(autreActivitéSanitaire.dateDeFin) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
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

  public get dateDeMiseÀJourDesAutresActivités(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireAutorisations.autresActivités.dateMiseÀJourSource);
  }

  public get lesAutresActivitésSontEllesRenseignées(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.autresActivités.activités.length !== 0;
  }

  public get reconnaissancesContractuelles(): ReactElement {
    const reconnaissancesContractuellesDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles;

    return (
      <ul aria-label="activités" className={`${stylesBlocAutorisationsEtCapacités["liste-activités"]}`}>
        {reconnaissancesContractuellesDeLÉtablissement.activités.map((activité) => (
          <li key={`activité-${activité.code}`}>
            <TagCliquable for={`reconnaissances-contractuelles-accordion-${activité.code}`} titre={`${activité.libellé} [${activité.code}]`} />
            <ul className="fr-collapse niveau1" id={`reconnaissances-contractuelles-accordion-${activité.code}`}>
              {activité.modalités.map((modalité) => (
                <li key={`modalité-${modalité.code}`}>
                  <TagCliquable
                    for={`reconnaissances-contractuelles-accordion-${activité.code}-${modalité.code}`}
                    texteGras={false}
                    titre={`${modalité.libellé} [${modalité.code}]`}
                  />
                  <ul className="fr-collapse niveau2" id={`reconnaissances-contractuelles-accordion-${activité.code}-${modalité.code}`}>
                    {modalité.formes.map((forme) => {
                      const reconnaissancesContractuellesSanitaire = forme.reconnaissanceContractuelleSanitaire;
                      return (
                        <li key={`forme-${forme.code}`}>
                          <TagGroup label="reconnaissance-contractuelle">
                            <Tag label={`${forme.libellé} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
                            <Tag
                              label={`${this.wording.NUMÉRO_ARHGOS} : ${
                                reconnaissancesContractuellesSanitaire.numéroArhgos ? reconnaissancesContractuellesSanitaire.numéroArhgos : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.NUMÉRO_CPOM}
                              {`: ${reconnaissancesContractuellesSanitaire.numéroCpom ? reconnaissancesContractuellesSanitaire.numéroCpom : "N/A"}`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_D_EFFET_ASR}
                              {`: ${
                                reconnaissancesContractuellesSanitaire.dateDEffetAsr
                                  ? StringFormater.formatDate(reconnaissancesContractuellesSanitaire.dateDEffetAsr)
                                  : "N/A"
                              }`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_D_EFFET_CPOM}
                              {`: ${
                                reconnaissancesContractuellesSanitaire.dateDEffetCpom
                                  ? StringFormater.formatDate(reconnaissancesContractuellesSanitaire.dateDEffetCpom)
                                  : "N/A"
                              }`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_DE_FIN_CPOM}
                              {`: ${
                                reconnaissancesContractuellesSanitaire.dateDeFinCpom
                                  ? StringFormater.formatDate(reconnaissancesContractuellesSanitaire.dateDeFinCpom)
                                  : "N/A"
                              }`}
                            </Tag>
                            <Tag
                              label={`${this.wording.CAPACITÉ_AUTORISÉE} : ${
                                reconnaissancesContractuellesSanitaire.capacitéAutorisée ? reconnaissancesContractuellesSanitaire.capacitéAutorisée : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
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

  public get dateDeMiseÀJourDesReconnaissancesContractuelles(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles.dateMiseÀJourSource);
  }

  public get lesReconnaissancesContractuellesSontEllesRenseignées(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles.activités.length !== 0;
  }

  public get équipementsMatérielsLourds(): ReactElement {
    const équipementsMatérielsLourdsDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds;

    return (
      <ul aria-label="équipements" className={`${stylesBlocAutorisationsEtCapacités["liste-activités"]}`}>
        {équipementsMatérielsLourdsDeLÉtablissement.équipements.map((équipements) => (
          <li key={`équipement-${équipements.code}`}>
            <TagCliquable for={`équipements-matériels-lourds-accordion-${équipements.code}`} titre={`${équipements.libellé} [${équipements.code}]`} />
            <ul className="fr-collapse niveau1" id={`équipements-matériels-lourds-accordion-${équipements.code}`}>
              {équipements.autorisations.map((autorisationÉquipementMatérielLourd) => {
                return (
                  <li key={`forme-${autorisationÉquipementMatérielLourd.numéroArhgos}`}>
                    <TagGroup label="équipement-matériel-lourd">
                      <Tag
                        label={`${this.wording.NUMÉRO_ARHGOS} : ${
                          autorisationÉquipementMatérielLourd.numéroArhgos ? autorisationÉquipementMatérielLourd.numéroArhgos : "N/A"
                        }`}
                        size={TAG_SIZE.SM}
                        withArrow
                      />
                      <Tag
                        label={`${this.wording.DATE_D_AUTORISATION} : ${
                          autorisationÉquipementMatérielLourd.dateDAutorisation
                            ? StringFormater.formatDate(autorisationÉquipementMatérielLourd.dateDAutorisation)
                            : "N/A"
                        }`}
                        size={TAG_SIZE.SM}
                      />
                      <Tag
                        label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${
                          autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre
                            ? StringFormater.formatDate(autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre)
                            : "N/A"
                        }`}
                        size={TAG_SIZE.SM}
                      />
                      <Tag
                        label={`${this.wording.DATE_DE_FIN} : ${
                          autorisationÉquipementMatérielLourd.dateDeFin ? StringFormater.formatDate(autorisationÉquipementMatérielLourd.dateDeFin) : "N/A"
                        }`}
                        size={TAG_SIZE.SM}
                      />
                    </TagGroup>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  public get dateDeMiseÀJourDesÉquipementsMatérielsLourds(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds.dateMiseÀJourSource);
  }

  public get lesÉquipementsMatérielsLourdsSontIlsRenseignés(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds.équipements.length !== 0;
  }
}
