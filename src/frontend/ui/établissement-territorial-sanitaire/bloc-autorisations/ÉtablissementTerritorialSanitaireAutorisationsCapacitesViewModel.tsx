import { ReactElement } from "react";

import {
  CapacitéSanitaireEntitéJuridique,
  EntitéJuridiqueAutorisationEtCapacité,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { Wording } from "../../../configuration/wording/Wording";
import { BalloonTags } from "../../commun/Graphique/BalloonTags";
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
                                autorisationSanitaire.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autorisationSanitaire.dateDeMiseEnOeuvre) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_DE_FIN} : ${
                                autorisationSanitaire.dateDeFin ? StringFormater.formateLaDate(autorisationSanitaire.dateDeFin) : "N/A"
                              }`}
                              size={TAG_SIZE.SM}
                            />
                            <Tag
                              label={`${this.wording.DATE_D_AUTORISATION} : ${
                                autorisationSanitaire.dateDAutorisation ? StringFormater.formateLaDate(autorisationSanitaire.dateDAutorisation) : "N/A"
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
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.autorisations.dateMiseÀJourSource);
  }

  public get autresActivités(): ReactElement {
    // const autresActivitésDeLÉtablissement = this.établissementTerritorialSanitaireAutorisations.autresActivités;

    const mockFormDetails = [
      {
        libellé: "label 3",
        code: "03",
        formName: [
          {
            etablissementTerritorial: {
              numeroFiness: "99999999",
              nom: "amazing Hospital",
            },
            authorisation: [
              {
                nom: "dateDAutorisation",
                value: "10/02/2020",
              },
              {
                nom: "dateDeFin",
                value: "10/10/2023",
              },
              {
                nom: "dateDeMiseEnOeuvre",
                value: "13/05/2025",
              },
            ],
          },
          {
            etablissementTerritorial: {
              numeroFiness: "11111111",
              nom: "rainbow Hospital",
            },
            authorisation: [
              {
                nom: "dateDAutorisation",
                value: "10/02/2020",
              },
              {
                nom: "dateDeFin",
                value: "10/10/2023",
              },
              {
                nom: "dateDeMiseEnOeuvre",
                value: "13/05/2025",
              },
            ],
          },
        ],
      },
    ];

    const mockFormDetails2 = [
      {
        libellé: "label 3",
        code: "05",
        formName: [
          {
            etablissementTerritorial: {
              numeroFiness: "77777777",
              nom: "regular Hospital",
            },
            authorisation: [
              {
                nom: "dateDAutorisation",
                value: "10/02/2020",
              },
              {
                nom: "dateDeFin",
                value: "10/10/2023",
              },
              {
                nom: "dateDeMiseEnOeuvre",
                value: "13/05/2025",
              },
            ],
          },
        ],
      },
    ];

    const mockSecondaryLabel = [
      {
        libellé: "secondLabel",
        code: "99",
        formDetails: mockFormDetails,
      },
    ];

    const mockSecondaryLabel2 = [
      {
        libellé: "secondLabel",
        code: "55",
        formDetails: mockFormDetails2,
      },
    ];

    const mockPrimaryLabel = [
      {
        libellé: "label",
        code: "01",
        secondaryLabel: mockSecondaryLabel,
      },
      {
        libellé: "label2",
        code: "02",
        secondaryLabel: mockSecondaryLabel2,
      },
    ];

    const mockCapacite: CapacitéSanitaireEntitéJuridique[] = [];

    const mockEJ: EntitéJuridiqueAutorisationEtCapacité = {
      autreActivities: mockPrimaryLabel,
      capacités: mockCapacite,
      numéroFinessEntitéJuridique: "12345678",
    };

    return <BalloonTags entityJuridiqueAuth={mockEJ.autreActivities} />;

    // return (
    //   <ul aria-label="activités" className={`${stylesBlocAutorisationsEtCapacités["liste-activités"]}`}>
    //     {autresActivitésDeLÉtablissement.activités.map((activité) => (
    //       <li key={`activité-${activité.code}`}>
    //         <TagCliquable for={`autresActivités-accordion-${activité.code}`} titre={`${activité.libellé} [${activité.code}]`} />
    //         <ul className=" fr-collapse niveau1" id={`autresActivités-accordion-${activité.code}`}>
    //           {activité.modalités.map((modalité) => (
    //             <li key={`modalité-${modalité.code}`}>
    //               <TagCliquable
    //                 for={`autresActivités-accordion-${activité.code}-${modalité.code}`}
    //                 texteGras={false}
    //                 titre={`${modalité.libellé} [${modalité.code}]`}
    //               />
    //               <ul className="fr-collapse niveau2" id={`autresActivités-accordion-${activité.code}-${modalité.code}`}>
    //                 {modalité.formes.map((forme) => {
    //                   const autreActivitéSanitaire = forme.autreActivitéSanitaire;
    //                   return (
    //                     <li key={`forme-${forme.code}`}>
    //                       <TagGroup label="autre-activité">
    //                         <Tag label={`${forme.libellé} [${forme.code}]`} size={TAG_SIZE.SM} withArrow />
    //                         <Tag
    //                           label={`${this.wording.DATE_D_AUTORISATION} : ${
    //                             autreActivitéSanitaire.dateDAutorisation ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDAutorisation) : "N/A"
    //                           }`}
    //                           size={TAG_SIZE.SM}
    //                         />
    //                         <Tag
    //                           label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${
    //                             autreActivitéSanitaire.dateDeMiseEnOeuvre ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDeMiseEnOeuvre) : "N/A"
    //                           }`}
    //                           size={TAG_SIZE.SM}
    //                         />
    //                         <Tag
    //                           label={`${this.wording.DATE_DE_FIN} : ${
    //                             autreActivitéSanitaire.dateDeFin ? StringFormater.formateLaDate(autreActivitéSanitaire.dateDeFin) : "N/A"
    //                           }`}
    //                           size={TAG_SIZE.SM}
    //                         />
    //                       </TagGroup>
    //                     </li>
    //                   );
    //                 })}
    //               </ul>
    //             </li>
    //           ))}
    //         </ul>
    //       </li>
    //     ))}
    //   </ul>
    // );
  }

  public get dateDeMiseÀJourDesAutresActivités(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.autresActivités.dateMiseÀJourSource);
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
                                  ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDEffetAsr)
                                  : "N/A"
                              }`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_D_EFFET_CPOM}
                              {`: ${
                                reconnaissancesContractuellesSanitaire.dateDEffetCpom
                                  ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDEffetCpom)
                                  : "N/A"
                              }`}
                            </Tag>
                            <Tag size={TAG_SIZE.SM}>
                              {this.wording.DATE_DE_FIN_CPOM}
                              {`: ${
                                reconnaissancesContractuellesSanitaire.dateDeFinCpom
                                  ? StringFormater.formateLaDate(reconnaissancesContractuellesSanitaire.dateDeFinCpom)
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
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles.dateMiseÀJourSource);
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
                            ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDAutorisation)
                            : "N/A"
                        }`}
                        size={TAG_SIZE.SM}
                      />
                      <Tag
                        label={`${this.wording.DATE_DE_MISE_EN_OEUVRE} : ${
                          autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre
                            ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDeMiseEnOeuvre)
                            : "N/A"
                        }`}
                        size={TAG_SIZE.SM}
                      />
                      <Tag
                        label={`${this.wording.DATE_DE_FIN} : ${
                          autorisationÉquipementMatérielLourd.dateDeFin ? StringFormater.formateLaDate(autorisationÉquipementMatérielLourd.dateDeFin) : "N/A"
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
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds.dateMiseÀJourSource);
  }

  public get lesÉquipementsMatérielsLourdsSontIlsRenseignés(): boolean {
    return this.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds.équipements.length !== 0;
  }
}
