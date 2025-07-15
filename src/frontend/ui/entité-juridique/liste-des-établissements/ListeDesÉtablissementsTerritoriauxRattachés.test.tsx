import { fireEvent, screen, within } from "@testing-library/react";

import { EtablissementsTerritoriauxRattachésViewModel } from "./EtablissementsTerritoriauxRattachésViewModel";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./ListeDesÉtablissementsTerritoriauxRattachés";
import { EtablissementsTerritoriauxRattachésTestBuilder } from "../../../test-helpers/test-builder/EtablissementsTerritoriauxRattachésTestBuilder";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { paths, wording } = fakeFrontDependencies;

describe("affiche la liste des établissements territoriaux rattachés à l’entité juridique", () => {
  let établissementsTerritoriauxRattachésViewModels: EtablissementsTerritoriauxRattachésViewModel;

  beforeAll(() => {
    établissementsTerritoriauxRattachésViewModels = new EtablissementsTerritoriauxRattachésTestBuilder(wording)
      .avecEtablissementMédicoSocial()
      .avecEtablissementSanitaire()
      .build();
  });

  it("affiche le titre de la liste avec le nombre d'établissements total", () => {
    // WHEN
    renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

    // THEN
    const titre = screen.getByRole("heading", {
      level: 2,
      name: "2 " + wording.ÉTABLISSEMENTS_RATTACHÉS,
    });
    expect(titre).toBeInTheDocument();
  });

  it("affiche la liste des établissements rattachés avec un lien pour accéder à chaque établissement comportant le numéro FINESS de l’établissement et son nom court", () => {
    // WHEN
    renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

    // THEN
    const listeDesÉtablissementsRattachés = screen.getAllByRole("listitem");
    expect(listeDesÉtablissementsRattachés).toHaveLength(établissementsTerritoriauxRattachésViewModels.nombreEtablissements);
    const établissementTerritorialMédicoSocial = within(listeDesÉtablissementsRattachés[0]).getByRole("link", {
      name: "ET - 0100000400 - CH NANTUA",
    });
    expect(établissementTerritorialMédicoSocial).toHaveAttribute("href", `${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/0100000400`);
    const abréviationÉtablissementTerritorial = within(établissementTerritorialMédicoSocial).getByText("ET", { selector: "abbr" });
    expect(abréviationÉtablissementTerritorial).toHaveAttribute("title", wording.ÉTABLISSEMENT_TERRITORIAL);
    const établissementTerritorialSanitaire = within(listeDesÉtablissementsRattachés[1]).getByRole("link", {
      name: "ET - 5907825531 - HP VILLENEUVE DASCQ",
    });
    expect(établissementTerritorialSanitaire).toHaveAttribute("href", `${paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE}/5907825531`);
  });

  describe("EJ avec des ET sanitaires rattachés uniquement", () => {
    beforeAll(() => {
      // GIVEN
      établissementsTerritoriauxRattachésViewModels = new EtablissementsTerritoriauxRattachésTestBuilder(wording)
        .avecEtablissementSanitaire({ numéroFiness: "445566" })
        .avecEtablissementSanitaire({ numéroFiness: "112233" })
        .build();
    });

    it("affiche un tag pour regrouper les établissements sanitaires avec le nombre d'établissements", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

      // THEN
      const tagSanitaire = screen.getByText(wording.DOMAINE_SANITAIRE + " (2)");
      expect(tagSanitaire).toBeInTheDocument();
    });

    it("affiche la liste des établissements sanitaires sous le tag trié par FINESS", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(2);
      expect(within(itemEtablissementSanitaire[0]).getByText("445566", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementSanitaire[1]).getByText("112233", { exact: false })).toBeInTheDocument();
    });

    it("n'affiche pas le tag ni la liste s'il n'y a pas d'établissements sanitaire", () => {
      // GIVEN
      const pasDetablissementTerritoriaux = new EtablissementsTerritoriauxRattachésTestBuilder(wording).build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={pasDetablissementTerritoriaux} />);

      // THEN
      const tagSanitaire = screen.queryByText(wording.DOMAINE_SANITAIRE, { exact: false });
      expect(tagSanitaire).not.toBeInTheDocument();
    });
  });

  describe("EJ avec des ET médicaux sociaux rattachés uniquement", () => {
    beforeAll(() => {
      // GIVEN
      établissementsTerritoriauxRattachésViewModels = new EtablissementsTerritoriauxRattachésTestBuilder(wording)
        .avecEtablissementMédicoSocial({ numéroFiness: "445566" })
        .avecEtablissementMédicoSocial({ numéroFiness: "112233" })
        .build();
    });

    it("affiche un tag pour regrouper les établissements médicaux sociaux avec le nombre d'établissements", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

      // THEN
      const tagSanitaire = screen.getByText(wording.DOMAINE_MEDICAUX_SOCIAL + " (2)");
      expect(tagSanitaire).toBeInTheDocument();
    });

    it("affiche la liste des établissements médicaux sociaux sous le tag trié par FINESS", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(2);
      expect(within(itemEtablissementSanitaire[0]).getByText("445566", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementSanitaire[1]).getByText("112233", { exact: false })).toBeInTheDocument();
    });

    it("n'affiche pas le tag ni la liste s'il n'y a pas d'établissements médicaux sociaux", () => {
      // GIVEN
      const pasDetablissementTerritoriaux = new EtablissementsTerritoriauxRattachésTestBuilder(wording).build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={pasDetablissementTerritoriaux} />);

      // THEN
      const tagSanitaire = screen.queryByText(wording.DOMAINE_MEDICAUX_SOCIAL, { exact: false });
      expect(tagSanitaire).not.toBeInTheDocument();
    });
  });

  describe("EJ avec des ET médicaux sociaux et des ET sanitaires rattachés", () => {
    beforeAll(() => {
      // GIVEN
      établissementsTerritoriauxRattachésViewModels = new EtablissementsTerritoriauxRattachésTestBuilder(wording)
        .avecEtablissementMédicoSocial({ numéroFiness: "445566" })
        .avecEtablissementSanitaire({ numéroFiness: "999888" })
        .avecEtablissementMédicoSocial({ numéroFiness: "778899" })
        .avecEtablissementMédicoSocial({ numéroFiness: "556677" })
        .avecEtablissementSanitaire({ numéroFiness: "222333" })
        .build();
    });

    it("affiche les deux tags avec en premier celui qui contient le plus d'établissements", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

      // THEN
      const tagMedicauxSocial = screen.getByText(wording.DOMAINE_MEDICAUX_SOCIAL + " (3)");
      expect(tagMedicauxSocial).toBeInTheDocument();
      const tagSanitaire = screen.getByText(wording.DOMAINE_SANITAIRE + " (2)");
      expect(tagSanitaire).toBeInTheDocument();
    });

    it("affiche la liste des établissements en fonction de leur tag trié par finess", () => {
      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />);

      // THEN
      const listeEtablissementMedicauxSociaux = screen.getAllByRole("list")[0];
      const itemEtablissementMedicauxSociaux = within(listeEtablissementMedicauxSociaux).getAllByRole("listitem");
      expect(itemEtablissementMedicauxSociaux).toHaveLength(3);
      expect(within(itemEtablissementMedicauxSociaux[0]).getByText("445566", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementMedicauxSociaux[1]).getByText("778899", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementMedicauxSociaux[2]).getByText("556677", { exact: false })).toBeInTheDocument();

      const listeEtablissementSanitaire = screen.getAllByRole("list")[1];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(2);
      expect(within(itemEtablissementSanitaire[0]).getByText("999888", { exact: false })).toBeInTheDocument();
      expect(within(itemEtablissementSanitaire[1]).getByText("222333", { exact: false })).toBeInTheDocument();
    });

    it("n'affiche pas le tag ni la liste s'il n'y a pas d'établissements médicaux sociaux", () => {
      // GIVEN
      const pasDetablissementTerritoriaux = new EtablissementsTerritoriauxRattachésTestBuilder(wording).build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={pasDetablissementTerritoriaux} />);

      // THEN
      const tagSanitaire = screen.queryByText(wording.DOMAINE_MEDICAUX_SOCIAL, { exact: false });
      expect(tagSanitaire).not.toBeInTheDocument();
    });
  });

  describe("EJ sans ET rattachés", () => {
    it("doit afficher qu'aucun n'établissements n'est rattaché à cet EJ", () => {
      // GIVEN
      const pasDetablissementTerritoriaux = new EtablissementsTerritoriauxRattachésTestBuilder(wording).build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={pasDetablissementTerritoriaux} />);

      // THEN
      const titre = screen.getByRole("heading", {
        level: 2,
        name: wording.AUCUN_ÉTABLISSEMENTS_RATTACHÉS,
      });
      expect(titre).toBeInTheDocument();
    });

    it("n’affiche pas la liste des établissements territoriaux rattachés quand l’entité juridique n’en a pas", () => {
      // GIVEN
      const pasDetablissementTerritoriaux = new EtablissementsTerritoriauxRattachésTestBuilder(wording).build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={pasDetablissementTerritoriaux} />);

      // THEN
      const établissementTerritoriauxRattachés = screen.queryByRole("list");
      expect(établissementTerritoriauxRattachés).not.toBeInTheDocument();
    });
  });

  describe("Voir plus d'établissements", () => {
    it("doit limiter a 10 ET Sanitaire et afficher le bouton pour voir plus d'établissements", () => {
      // GIVEN
      const onzeETSanitaire = new EtablissementsTerritoriauxRattachésTestBuilder(wording).avecNEtablissementsSanitaires(11).build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={onzeETSanitaire} />);

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(10);
      const boutonVoirPlus = screen.getByText(wording.VOIR_TOUS_LES_ET);
      expect(boutonVoirPlus).toBeInTheDocument();
    });

    it("doit limiter a 10 ET Medico-Sociaux et afficher le bouton pour voir plus d'établissements", () => {
      // GIVEN
      const onzeETMedicoSociaux = new EtablissementsTerritoriauxRattachésTestBuilder(wording).avecNEtablissementsMedicoSociaux(11).build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={onzeETMedicoSociaux} />);

      // THEN
      const listeEtablissementMedicoSociaux = screen.getAllByRole("list")[0];
      const itemEtablissementMedicoSociaux = within(listeEtablissementMedicoSociaux).getAllByRole("listitem");
      expect(itemEtablissementMedicoSociaux).toHaveLength(10);
      const boutonVoirPlus = screen.getByText(wording.VOIR_TOUS_LES_ET);
      expect(boutonVoirPlus).toBeInTheDocument();
    });

    it("doit afficher tous les établissements au clic sur voir plus", () => {
      const onzeETMedicoSociauxEtSanitaires = new EtablissementsTerritoriauxRattachésTestBuilder(wording)
        .avecNEtablissementsSanitaires(15)
        .avecNEtablissementsMedicoSociaux(12)
        .build();
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={onzeETMedicoSociauxEtSanitaires} />);

      // WHEN
      const voirPlus = screen.getByText(wording.VOIR_TOUS_LES_ET);
      fireEvent.click(voirPlus);

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(15);

      const listeEtablissementMedicoSociaux = screen.getAllByRole("list")[1];
      const itemEtablissementMedicoSociaux = within(listeEtablissementMedicoSociaux).getAllByRole("listitem");
      expect(itemEtablissementMedicoSociaux).toHaveLength(12);
    });

    it("doit cacher le bouton voir plus et afficher le bouton voir moins quand on affiche tout", () => {
      const onzeEtSanitaires = new EtablissementsTerritoriauxRattachésTestBuilder(wording).avecNEtablissementsSanitaires(15).build();
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={onzeEtSanitaires} />);

      // WHEN
      const voirPlus = screen.getByText(wording.VOIR_TOUS_LES_ET);
      fireEvent.click(voirPlus);

      // THEN
      const boutonVoirMoins = screen.getByText(wording.VOIR_MOINS_ET);
      expect(boutonVoirMoins).toBeInTheDocument();
      expect(voirPlus).not.toBeInTheDocument();
    });

    it("doit afficher 10 ET maximum au clic sur voir moins", () => {
      const quinzeETSanitaires = new EtablissementsTerritoriauxRattachésTestBuilder(wording).avecNEtablissementsSanitaires(15).build();
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={quinzeETSanitaires} />);
      const voirPlus = screen.getByText(wording.VOIR_TOUS_LES_ET);
      fireEvent.click(voirPlus);

      // WHEN
      const boutonVoirMoins = screen.getByText(wording.VOIR_MOINS_ET);
      fireEvent.click(boutonVoirMoins);

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const itemEtablissementSanitaire = within(listeEtablissementSanitaire).getAllByRole("listitem");
      expect(itemEtablissementSanitaire).toHaveLength(10);
    });

    it("ne doit pas afficher le bouton voir plus s'il y a moins de 10 ET sanitaire et médico-sociaux", () => {
      const deuxETSanitaires = new EtablissementsTerritoriauxRattachésTestBuilder(wording)
        .avecNEtablissementsSanitaires(2)
        .avecNEtablissementsMedicoSociaux(1)
        .build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={deuxETSanitaires} />);

      // THEN
      const voirPlus = screen.queryByText(wording.VOIR_TOUS_LES_ET);
      expect(voirPlus).not.toBeInTheDocument();
    });

    it("ne doit pas afficher le bouton voir moins s'il on a pas cliqué sur voir plus", () => {
      const deuxETSanitaires = new EtablissementsTerritoriauxRattachésTestBuilder(wording)
        .avecNEtablissementsSanitaires(2)
        .avecNEtablissementsMedicoSociaux(1)
        .build();

      // WHEN
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={deuxETSanitaires} />);

      // THEN
      const boutonVoirMoins = screen.queryByText(wording.VOIR_MOINS_ET);
      expect(boutonVoirMoins).not.toBeInTheDocument();
    });

    it("a11y - Le premier lien sur l'ET supplémentaire affiché doit avoir le focus", () => {
      const douzeETSanitaires = new EtablissementsTerritoriauxRattachésTestBuilder(wording).avecNEtablissementsSanitaires(12).build();
      renderFakeComponent(<ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={douzeETSanitaires} />);

      // WHEN
      const voirPlus = screen.getByText(wording.VOIR_TOUS_LES_ET);
      fireEvent.click(voirPlus);

      // THEN
      const listeEtablissementSanitaire = screen.getAllByRole("list")[0];
      const premierETSupplémentaireAffiché = within(listeEtablissementSanitaire).getAllByRole("link")[douzeETSanitaires.LIMIT_ET_AFFICHES];
      expect(premierETSupplémentaireAffiché).toHaveFocus();
    });
  });
});
