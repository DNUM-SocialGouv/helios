import { fireEvent, render, screen } from "@testing-library/react";

import { useModalSelectionIndicateur, getInitialIndicatorsState } from "./useModalSelectionIndicateur";

type TestComponentProps = Readonly<{ structure: string }>;
type IndicatorFixture = Readonly<{ label: string; columnName: string; enabledByDefault: boolean }>;

type StructureFixture = Readonly<{
  structure: string;
  indicators: readonly IndicatorFixture[];
}>;

const getIndicatorsByStructure = (): readonly StructureFixture[] => {
  const initialIndicatorsState = getInitialIndicatorsState();

  return Array.from(initialIndicatorsState.entries()).map(([structureKey, structureIndicators]) => {
    // On map le nom de la structure dans l’indicateur au nom attendu par le composant
    let structure: string;
    switch (structureKey) {
      case "medicoSocial":
        structure = "Médico-social";
        break;
      case "sanitaire":
        structure = "Sanitaire";
        break;
      case "entiteJuridique":
        structure = "Entité juridique";
        break;
      default:
        structure = structureKey;
    }

    // On transforme les indicateurs de chaque structure en un format plus simple pour les tests, on retire la notion de «groupe» d’indicateurs
    const indicators = [...structureIndicators.values()].flatMap((categoryIndicators) =>
      categoryIndicators.map(({ displayName, columnName, enabled }) => ({
        label: displayName,
        columnName,
        enabledByDefault: enabled,
      }))
    );

    return { structure, indicators };
  });
};

const STRUCTURE_FIXTURES = getIndicatorsByStructure();

const TestComponent = ({ structure }: TestComponentProps) => {
  const { enabledIndicators, generateModal, openIndicatorSelectionModal } = useModalSelectionIndicateur(structure);

  return (
    <>
      <button onClick={openIndicatorSelectionModal} type="button">
        Ouvrir modal
      </button>
      <div data-testid="enabled-indicators">{enabledIndicators.join(",")}</div>
      {generateModal()}
    </>
  );
};

const openModal = () => {
  fireEvent.click(screen.getByText("Ouvrir modal"));
};

const validateSelection = () => {
  fireEvent.click(screen.getByText("Valider"));
};

const getEnabledIndicators = (): string[] => {
  const content = screen.getByTestId("enabled-indicators").textContent;
  if (!content) return [];
  return content.split(",");
};

describe("useModalSelectionIndicateur - Test de la desactivation/réactivation des indicateurs", () => {
  it.each(STRUCTURE_FIXTURES)(
    "test des indicateurs pour la structure «$structure», on valide les transitions true -> false puis false -> true",
    ({ structure, indicators }) => {
      render(<TestComponent structure={structure} />);

      indicators.forEach(({ label, columnName, enabledByDefault }) => {
        openModal();
        expect(getEnabledIndicators().includes(columnName)).toBe(enabledByDefault);

        fireEvent.click(screen.getByLabelText(label));
        validateSelection();

        expect(getEnabledIndicators().includes(columnName)).toBe(!enabledByDefault);

        openModal();
        fireEvent.click(screen.getByLabelText(label));
        validateSelection();

        expect(getEnabledIndicators().includes(columnName)).toBe(enabledByDefault);
      });
    }
  );
});
