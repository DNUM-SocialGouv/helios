import { screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { BlocAutorisationsCapacites } from "./BlocAutorisationsCapacites";
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./EntitéJuridiqueAutorisationsCapacitesViewModel";
import {
  AutorisationActivitesAmm,
  AutorisationsActivités,
  AutresActivités,
  CapacitéSanitaireEntitéJuridique,
  EquipementsMateriauxLourdsActivités,
  ReconnaissanceContractuelleActivités,
} from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { annéeEnCours, fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;
const etabFiness = "123456789";
const etabTitle = "etabTitle";
const etabNom = "Test Entity";

describe("Bloc Autorisation et activités", () => {
  let viewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;

  beforeAll(() => {
    viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [mock<CapacitéSanitaireEntitéJuridique>({ année: annéeEnCours - 1 })],
      mock<AutorisationsActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<AutorisationActivitesAmm>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<AutresActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<ReconnaissanceContractuelleActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<EquipementsMateriauxLourdsActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      wording
    );
  });

  it("affiche le GraphiqueAutorisationActivite", () => {
    // GIVEN
    viewModel.autorisationsActivités = mock<AutorisationsActivités>({
      autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }],
      dateMiseÀJourSource: '11/11/2025'
    });

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    const titre = screen.getByText(wording.AUTORISATIONS_ACTIVITES, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le Graphique Autorisations médico-sociales", () => {
    // GIVEN
    viewModel.autorisationsMédicoSocial = mock<AutorisationsActivités>({
      autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test" }] }] }] }] }],
      dateMiseÀJourSource: '11/11/2025'
    });

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    const titre = screen.getByText(wording.AUTORISATIONS_MS, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche les dates et capacités des autorisations médico-sociales pour chaque ET concerné", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [mock<CapacitéSanitaireEntitéJuridique>({ année: annéeEnCours - 1 })],
      mock<AutorisationsActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<AutorisationActivitesAmm>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<AutresActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<ReconnaissanceContractuelleActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      mock<EquipementsMateriauxLourdsActivités>({ autorisations: [], dateMiseÀJourSource: '11/11/2025' }),
      wording,
      {
        autorisations: [{
          code: "657",
          libelle: "Accueil temporaire pour Personnes Âgées",
          modalites: [{
            code: "11",
            libelle: "Hébergement Complet Internat",
            formes: [{
              code: "702",
              libelle: "PH vieillissantes",
              autorisationEtablissements: [{
                numeroFiness: "010000040",
                nomEtablissement: "CH NANTUA",
                autorisations: [
                  { nom: wording.DATE_D_AUTORISATION, valeur: "01/01/2020" },
                  { nom: wording.MISE_À_JOUR_AUTORISATION, valeur: "05/04/2020" },
                  { nom: wording.DERNIÈRE_INSTALLATION, valeur: "03/02/2021" },
                  { nom: wording.CAPACITÉ_AUTORISÉE, valeur: "10" },
                  { nom: wording.CAPACITÉ_INSTALLÉE, valeur: "0" },
                ],
              }],
            }],
          }],
        }],
        dateMiseÀJourSource: '11/11/2025'
      }
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    expect(screen.getByText(`${wording.DATE_D_AUTORISATION} : 01/01/2020`)).toBeInTheDocument();
    expect(screen.getByText(`${wording.MISE_À_JOUR_AUTORISATION} : 05/04/2020`)).toBeInTheDocument();
    expect(screen.getByText(`${wording.DERNIÈRE_INSTALLATION} : 03/02/2021`)).toBeInTheDocument();
    expect(screen.getByText(`${wording.CAPACITÉ_AUTORISÉE} : 10`)).toBeInTheDocument();
    expect(screen.getByText(`${wording.CAPACITÉ_INSTALLÉE} : 0`)).toBeInTheDocument();
  });

  it("affiche le Graphique Autres Activite", () => {
    // GIVEN
    viewModel.autresActivités = mock<AutresActivités>({
      autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test2" }] }] }] }] }],
      dateMiseÀJourSource: '11/11/2025'

    });
    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    const titre = screen.getByText(wording.AUTRES_ACTIVITÉS, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le Graphique Reconnaissance Contractuelles", () => {
    // GIVEN
    viewModel.reconnaissanceActivités = mock<ReconnaissanceContractuelleActivités>({
      autorisations: [{ modalites: [{ formes: [{ autorisationEtablissements: [{ autorisations: [{ nom: "test2" }] }] }] }] }],
      dateMiseÀJourSource: '11/11/2025'

    });

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    const titre = screen.getByText(wording.RECONNAISSANCES_CONTRACTUELLES, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("affiche le Graphique Equipement Lourds", () => {
    // GIVEN
    viewModel.equipementsLourds = mock<EquipementsMateriauxLourdsActivités>({
      autorisations: [{ equipementEtablissements: [{ equipements: [{ autorisations: [{ nom: "test2", valeur: "10" }] }] }] }],
      dateMiseÀJourSource: '11/11/2025'
    });

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    const titre = screen.getByText(wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS, { selector: "h3" });
    expect(titre).toBeInTheDocument();
  });

  it("n'affiche pas les autorisations s'il n'y a pas de valeur", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    const autorisationActivites = screen.queryByText(wording.AUTORISATIONS_ACTIVITES, { selector: "h3" });
    const autresActivites = screen.queryByText(wording.AUTRES_ACTIVITÉS, { selector: "h3" });
    const reconnaissanceContractuelles = screen.queryByText(wording.RECONNAISSANCES_CONTRACTUELLES, { selector: "h3" });
    expect(autorisationActivites).not.toBeInTheDocument();
    expect(autresActivites).not.toBeInTheDocument();
    expect(reconnaissanceContractuelles).not.toBeInTheDocument();
  });

  it("affiche un l'indicateur vide si il n'y a pas des données", () => {
    // GIVEN
    const viewModel = new EntitéJuridiqueAutorisationsCapacitesViewModel(
      [],
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      { autorisations: [], dateMiseÀJourSource: "" },
      wording
    );

    // WHEN
    renderFakeComponent(<BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={viewModel} etabFiness={etabFiness} etabNom={etabNom} etabTitle={etabTitle} />);

    // THEN
    const titre = screen.getByText(wording.INDICATEURS_VIDES);
    expect(titre).toBeInTheDocument();
  });
});
