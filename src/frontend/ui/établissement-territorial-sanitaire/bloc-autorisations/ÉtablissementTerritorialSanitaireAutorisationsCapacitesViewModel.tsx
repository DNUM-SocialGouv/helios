import { ReactElement } from "react";

import stylesBlocAutorisationsEtCapacités from "./BlocAutorisationEtCapacitéSanitaire.module.css";
import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { Wording } from "../../../configuration/wording/Wording";
import { StringFormater } from "../../commun/StringFormater";
import { Tag, TAG_SIZE, TagCliquable, TagGroup } from "../../commun/Tag";
import { GraphiqueCapacitésParActivitéViewModel } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivitéViewModel";

export class EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel {
  public graphiqueCapacitésParActivitéViewModel: GraphiqueCapacitésParActivitéViewModel;

  constructor(
    private readonly établissementTerritorialSanitaireAutorisations: ÉtablissementTerritorialSanitaire["autorisationsEtCapacités"],
    private wording: Wording
  ) {
    this.graphiqueCapacitésParActivitéViewModel = new GraphiqueCapacitésParActivitéViewModel(établissementTerritorialSanitaireAutorisations.capacités, wording);
  }

  public get lesDonnéesAutorisationEtCapacitéPasAutorisés(): string[] {
    const nonAutorisés = [];
    if (!this.graphiqueCapacitésParActivitéViewModel.lesCapacitésParActivitésSontEllesAutorisées) nonAutorisés.push(this.wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE);
    if (!this.lesAutorisationsSontEllesAutorisées) nonAutorisés.push(this.wording.AUTORISATIONS_SANITAIRE);
    if (!this.lesAutresActivitésSontEllesAutorisées) nonAutorisés.push(this.wording.AUTRES_ACTIVITÉS_SAN);
    if (!this.lesReconnaissancesContractuellesSontEllesAutorisées) nonAutorisés.push(this.wording.RECONNAISSANCES_CONTRACTUELLES);
    if (!this.lesÉquipementsMatérielsLourdsSontIlsAutorisés) nonAutorisés.push(this.wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS);
    return nonAutorisés;
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

  public get lesDonnéesAutorisationEtCapacitéPasRenseignees(): string[] {
    const nonRenseignes = [];
    if (!this.graphiqueCapacitésParActivitéViewModel.lesCapacitésParActivitésSontEllesRenseignées) nonRenseignes.push(this.wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE);
    if (!this.lesAutorisationsSontEllesRenseignées) nonRenseignes.push(this.wording.AUTORISATIONS_SANITAIRE);
    if (!this.lesAutresActivitésSontEllesRenseignées) nonRenseignes.push(this.wording.AUTRES_ACTIVITÉS_SAN);
    if (!this.lesReconnaissancesContractuellesSontEllesRenseignées) nonRenseignes.push(this.wording.RECONNAISSANCES_CONTRACTUELLES);
    if (!this.lesÉquipementsMatérielsLourdsSontIlsRenseignés) nonRenseignes.push(this.wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS);
    return nonRenseignes;
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
                              label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autorisationSanitaire.dateDeMiseEnOeuvre ? StringFormater.formatDate(autorisationSanitaire.dateDeMiseEnOeuvre) : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_FIN} : ${autorisationSanitaire.dateDeFin ? StringFormater.formatDate(autorisationSanitaire.dateDeFin) : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_D_AUTORISATION} : ${autorisationSanitaire.dateDAutorisation ? StringFormater.formatDate(autorisationSanitaire.dateDAutorisation) : "N/A"
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
    return this.établissementTerritorialSanitaireAutorisations.autorisations.activités.length !== 0 || this.établissementTerritorialSanitaireAutorisations.autorisationsAmm.activites.length !== 0;
  }

  public get lesAutorisationsSontEllesAutorisées(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.autorisations.dateMiseÀJourSource !== '';
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
                              label={`${this.wording.DATE_D_AUTORISATION} : ${autreActivitéSanitaire.dateDAutorisation ? StringFormater.formatDate(autreActivitéSanitaire.dateDAutorisation) : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autreActivitéSanitaire.dateDeMiseEnOeuvre ? StringFormater.formatDate(autreActivitéSanitaire.dateDeMiseEnOeuvre) : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_FIN} : ${autreActivitéSanitaire.dateDeFin ? StringFormater.formatDate(autreActivitéSanitaire.dateDeFin) : "N/A"
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

  public get lesAutresActivitésSontEllesAutorisées(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.autresActivités.dateMiseÀJourSource !== '';
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
                              label={`${this.wording.NUMÉRO_ARHGOS} : ${reconnaissancesContractuellesSanitaire.numéroArhgos ? reconnaissancesContractuellesSanitaire.numéroArhgos : "N/A"
                                }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.NUMÉRO_CPOM}
                              {`: ${reconnaissancesContractuellesSanitaire.numéroCpom ? reconnaissancesContractuellesSanitaire.numéroCpom : "N/A"}`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_D_EFFET_ASR}
                              {`: ${reconnaissancesContractuellesSanitaire.dateDEffetAsr
                                ? StringFormater.formatDate(reconnaissancesContractuellesSanitaire.dateDEffetAsr)
                                : "N/A"
                                }`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_D_EFFET_CPOM}
                              {`: ${reconnaissancesContractuellesSanitaire.dateDEffetCpom
                                ? StringFormater.formatDate(reconnaissancesContractuellesSanitaire.dateDEffetCpom)
                                : "N/A"
                                }`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_DE_FIN_CPOM}
                              {`: ${reconnaissancesContractuellesSanitaire.dateDeFinCpom
                                ? StringFormater.formatDate(reconnaissancesContractuellesSanitaire.dateDeFinCpom)
                                : "N/A"
                                }`}
                            </Tag>
                            <Tag
                              label={`${this.wording.CAPACITÉ_AUTORISÉE} : ${reconnaissancesContractuellesSanitaire.capacitéAutorisée ? reconnaissancesContractuellesSanitaire.capacitéAutorisée : "N/A"
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

  public get lesReconnaissancesContractuellesSontEllesAutorisées(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles.dateMiseÀJourSource !== '';
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
                        label={`${this.wording.NUMÉRO_ARHGOS} : ${autorisationÉquipementMatérielLourd.numéroArhgos ? autorisationÉquipementMatérielLourd.numéroArhgos : "N/A"
                          }`}
                        size={TAG_SIZE.SM}
                        withArrow
                      />
                      <Tag
                        label={`${this.wording.DATE_D_AUTORISATION} : ${autorisationÉquipementMatérielLourd.dateDAutorisation
                          ? StringFormater.formatDate(autorisationÉquipementMatérielLourd.dateDAutorisation)
                          : "N/A"
                          }`}
                        size={TAG_SIZE.SM}
                      />
                      <Tag
                        label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre
                          ? StringFormater.formatDate(autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre)
                          : "N/A"
                          }`}
                        size={TAG_SIZE.SM}
                      />
                      <Tag
                        label={`${this.wording.DATE_DE_FIN} : ${autorisationÉquipementMatérielLourd.dateDeFin ? StringFormater.formatDate(autorisationÉquipementMatérielLourd.dateDeFin) : "N/A"
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


  public get autorisationsAmm(): ReactElement {
    const autorisationsAmmSanitaires = this.établissementTerritorialSanitaireAutorisations.autorisationsAmm;
    return (
      <ul aria-label="autorisation_amm" className={`${stylesBlocAutorisationsEtCapacités["liste-activités"]}`}>
        {autorisationsAmmSanitaires.activites.map((activite) => (
          <li key={`"autorisation_amm-${activite.code}`}>
            <TagCliquable for={`autorisation_amm-accordion-${activite.code}`} titre={`${activite.libelle} [${activite.code}]`} />
            <ul className="fr-collapse niveau1" id={`autorisation_amm-accordion-${activite.code}`}>
              {activite.modalites.map((modalite) => (
                <li className="fr-ml-2w" key={`modalité-${modalite.code}`}>
                  <TagCliquable
                    for={`autorisation_amm-accordion-${activite.code}-${modalite.code}`}
                    texteGras={false}
                    titre={`${modalite.libelle} [${modalite.code}]`}
                  />
                  <ul className="fr-collapse niveau2" id={`autorisation_amm-accordion-${activite.code}-${modalite.code}`}>
                    {modalite.mentions.map((mention) => (
                      <li className="fr-ml-2w" key={`mention-${mention.code}`}>
                        <TagCliquable
                          for={`autorisation_amm-accordion-${activite.code}-${modalite.code}-${mention.code}`}
                          texteGras={false}
                          titre={`${mention.libelle} [${mention.code}]`}
                        />
                        <ul className="fr-collapse niveau2" id={`autorisation_amm-accordion-${activite.code}-${modalite.code}-${mention.code}`}>
                          {mention.pratiques.map((pratique) => (
                            pratique.declarations.map((declaration) => {
                              return (
                                <li key={`pratique-${pratique.code}-declaration-${declaration.code}`}>
                                  <TagGroup label="pratique-declaration">
                                    <Tag label={`${pratique.libelle} [${pratique.code}]`} size={TAG_SIZE.SM} withArrow />
                                    <Tag label={`${declaration.libelle} [${declaration.code}]`} size={TAG_SIZE.SM} withArrow />
                                  </TagGroup>
                                  <div className="fr-ml-2w">
                                    <TagGroup label="autorisation_amm" >
                                      <Tag
                                        label={`${this.wording.NUMÉRO_ARHGOS} : ${declaration.codeAutorisationArhgos ? declaration.codeAutorisationArhgos : "N/A"}`}
                                        size={TAG_SIZE.SM}
                                      />
                                      <Tag
                                        label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${declaration.dateMiseEnOeuvre ? StringFormater.formatDate(declaration.dateMiseEnOeuvre) : "N/A"
                                          }`}
                                        size={TAG_SIZE.SM}
                                      />
                                      <Tag
                                        label={`${this.wording.DATE_DE_FIN} : ${declaration.dateFin ? StringFormater.formatDate(declaration.dateFin) : "N/A"
                                          }`}
                                        size={TAG_SIZE.SM}
                                      />
                                      <Tag
                                        label={`${this.wording.DATE_D_AUTORISATION} : ${declaration.dateAutorisation ? StringFormater.formatDate(declaration.dateAutorisation) : "N/A"
                                          }`}
                                        size={TAG_SIZE.SM}
                                      />
                                    </TagGroup>
                                  </div>
                                </li>
                              );
                            })
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
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

  public get lesÉquipementsMatérielsLourdsSontIlsAutorisés(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds.dateMiseÀJourSource !== '';
  }
}
