import { fireEvent, screen, within } from "@testing-library/react";

import { ÉtablissementTerritorialMédicoSocialViewModelTestBuilder } from "../../../../test-helpers/test-builder/ÉtablissementTerritorialMédicoSocialViewModelTestBuilder";
import { fakeFrontDependencies, renderFakeComponent, textMatch } from "../../../../test-helpers/testHelper";
import { BlocRessourcesHumainesMédicoSocial } from "../BlocRessourcesHumainesMédicoSocial";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "../ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";
import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";

const { wording } = fakeFrontDependencies;

describe("La page établissement territorial - bloc vigie rh", () => {
  const ressourcesHumainesViewModel = new ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel(
    ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.ressourcesHumaines,
    wording
  );
  const blocVigieRhEmptyViewModel = new BlocVigieRHViewModel(
    {
      pyramideAges: [],
      tranchesAgesLibelles: [],
      professionFiliere: { data: [], dateDeMiseAJour: '' },
      departsEmbauches: [],
      departsEmbauchesTrimestriels: []
    },
    wording
  );

  const blocVigieRhViewModel = new BlocVigieRHViewModel(
    ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.vigierh,
    wording
  );

  const EHPAD_CATEGORIE = "500 - Etablissement d'hébergement pour personnes âgées dépendantes";

  describe("Bloc vigie rh est visible que pour les Ehpads", () => {
    it("affiche le bloc vigie rh quand il s'agit d'un ehpad", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial blocVigieRhViewModel={blocVigieRhViewModel} categorie={EHPAD_CATEGORIE} setStatusSousBlocs={() => { }} statusSousBlocs={[]} établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      expect(ressourcesHumaines).toBeInTheDocument()
      const sousBlocRhHelios = screen.getByTestId('sous-bloc-rh-helios');
      expect(sousBlocRhHelios).toBeInTheDocument();
      expect(sousBlocRhHelios).toHaveTextContent(wording.INDICATEURS_HELIOS_BLOC_TITLE)
      const sousBlocVigieRh = screen.getByTestId('sous-bloc-vigie-rh');
      expect(sousBlocVigieRh).toBeInTheDocument();
      expect(sousBlocVigieRh).toHaveTextContent(wording.INDICATEURS_VIGIERH_BLOC_TITLE)
    });

    it("n'affiche pas le bloc vigie rh quand il ne s'agit pas d'un ehpad", () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial blocVigieRhViewModel={blocVigieRhViewModel} categorie="" setStatusSousBlocs={() => { }} statusSousBlocs={[]} établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      expect(ressourcesHumaines).toBeInTheDocument()
      const sousBlocRhHelios = screen.queryByTestId('sous-bloc-rh-helios');
      expect(sousBlocRhHelios).not.toBeInTheDocument();
      const sousBlocVigieRh = screen.queryByTestId('sous-bloc-vigie-rh');
      expect(sousBlocVigieRh).not.toBeInTheDocument();
    });
  });

  describe("L’indicateur pyramide des âges", () => {
    it("affiche l’intitulé de l’indicateur pyramide des âges et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial blocVigieRhViewModel={blocVigieRhViewModel} categorie={EHPAD_CATEGORIE} setStatusSousBlocs={() => { }} statusSousBlocs={[]} établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      expect(ressourcesHumaines).toBeInTheDocument()
      const sousBlocRhHelios = screen.getByTestId('sous-bloc-vigie-rh');
      expect(sousBlocRhHelios).toBeInTheDocument();
      expect(sousBlocRhHelios).toHaveTextContent(wording.INDICATEURS_VIGIERH_BLOC_TITLE)
      const indicateurs = within(sousBlocRhHelios).getAllByRole("listitem");
      const indicateur = indicateurs[0];
      const titre = within(indicateur).getByText(textMatch(wording.PYRAMIDE_DES_AGES), { selector: "h3" });
      expect(titre).toBeInTheDocument();
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-vr-pyramide-ages");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle du pyramide des âges après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial blocVigieRhViewModel={blocVigieRhViewModel} categorie={EHPAD_CATEGORIE} setStatusSousBlocs={() => { }} statusSousBlocs={[]} établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const sousBlocRhHelios = screen.getByTestId('sous-bloc-vigie-rh');
      expect(sousBlocRhHelios).toBeInTheDocument();
      expect(sousBlocRhHelios).toHaveTextContent(wording.INDICATEURS_VIGIERH_BLOC_TITLE)
      const indicateurs = within(sousBlocRhHelios).getAllByRole("listitem");
      const indicateur = indicateurs[0];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: wording.PYRAMIDE_DES_AGES });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
    });


    it("affiche l’intitulé de l’indicateur effectifs et un bouton pour accéder aux détails", () => {
      // WHEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial blocVigieRhViewModel={blocVigieRhViewModel} categorie={EHPAD_CATEGORIE} setStatusSousBlocs={() => { }} statusSousBlocs={[]} établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

      // THEN
      const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
      expect(ressourcesHumaines).toBeInTheDocument()
      const sousBlocRhHelios = screen.getByTestId('sous-bloc-vigie-rh');
      expect(sousBlocRhHelios).toBeInTheDocument();
      expect(sousBlocRhHelios).toHaveTextContent(wording.INDICATEURS_VIGIERH_BLOC_TITLE)
      const indicateurs = within(sousBlocRhHelios).getAllByRole("listitem");
      const indicateur = indicateurs[3];
      const titre = within(indicateur).getByText(textMatch(wording.EFFECTIFS), { selector: "h3" });
      expect(titre).toBeInTheDocument();
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });
      expect(détails).toHaveAttribute("aria-controls", "nom-info-bulle-vr-effectifs");
      expect(détails).toHaveAttribute("data-fr-opened", "false");
    });

    it('affiche le contenu de l’info bulle d"effectifs après avoir cliqué sur le bouton "détails"', () => {
      // GIVEN
      renderFakeComponent(<BlocRessourcesHumainesMédicoSocial blocVigieRhViewModel={blocVigieRhViewModel} categorie={EHPAD_CATEGORIE} setStatusSousBlocs={() => { }} statusSousBlocs={[]} établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);
      const sousBlocRhHelios = screen.getByTestId('sous-bloc-vigie-rh');
      expect(sousBlocRhHelios).toBeInTheDocument();
      expect(sousBlocRhHelios).toHaveTextContent(wording.INDICATEURS_VIGIERH_BLOC_TITLE)
      const indicateurs = within(sousBlocRhHelios).getAllByRole("listitem");
      const indicateur = indicateurs[3];
      const détails = within(indicateur).getByRole("button", { name: wording.DÉTAILS });

      // WHEN
      fireEvent.click(détails);

      // THEN
      expect(détails).toHaveAttribute("data-fr-opened", "true");
      const infoBulle = within(indicateur).getByRole("dialog", { name: wording.EFFECTIFS });
      const fermer = within(infoBulle).getByRole("button", { name: wording.FERMER });
      expect(fermer).toBeInTheDocument();
    });

  });


  it('affiche le message aucune donnée qd il pas de données vigieRH', () => {
    // WHEN
    renderFakeComponent(<BlocRessourcesHumainesMédicoSocial blocVigieRhViewModel={blocVigieRhEmptyViewModel} categorie={EHPAD_CATEGORIE} setStatusSousBlocs={() => { }} statusSousBlocs={[]} établissementTerritorialMédicoSocialRessourcesHumainesViewModel={ressourcesHumainesViewModel} />);

    // THEN
    const ressourcesHumaines = screen.getByRole("region", { name: wording.TITRE_BLOC_RESSOURCES_HUMAINES });
    expect(ressourcesHumaines).toBeInTheDocument()
    const sousBlocRhHelios = screen.getByTestId('sous-bloc-vigie-rh');
    expect(sousBlocRhHelios).toBeInTheDocument();
    expect(sousBlocRhHelios).toHaveTextContent(wording.INDICATEURS_VIGIERH_BLOC_TITLE)
    const aucuneDonneeMsg = within(sousBlocRhHelios).getByText(wording.INDICATEURS_VIDES);
    expect(aucuneDonneeMsg).toBeInTheDocument();
  });
});
