import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { ToggelMultipleBlocs } from "./ToggelMultipleBlocs";
import { fakeFrontDependencies } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;

describe("ToggelMultipleBlocs Component", () => {



  it("renders 'Tout replier' button when all statusBlocs are true", () => {
    const allTrue = jest.fn(() => true);
    const allFalse = jest.fn(() => false);
    const setAllValue = jest.fn();

    render(
      <ToggelMultipleBlocs
        allFalse={allFalse}
        allTrue={allTrue}
        setAllValue={setAllValue}
        statusBlocs={[true, true, true]}
      />
    );

    const button = screen.getByText(wording.TOUT_REPLIER);
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(setAllValue).toHaveBeenCalledWith(false);
  });

  it("renders 'Tout déplier' button when all statusBlocs are false", () => {
    const allTrue = jest.fn(() => false);
    const allFalse = jest.fn(() => true);
    const setAllValue = jest.fn();

    render(
      <ToggelMultipleBlocs
        allFalse={allFalse}
        allTrue={allTrue}
        setAllValue={setAllValue}
        statusBlocs={[false, false, false]}
      />
    );

    const button = screen.getByText(wording.TOUT_DEPLIER);
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(setAllValue).toHaveBeenCalledWith(true);
  });

  it("renders 'Tout déplier' button when statusBlocs are mixed", () => {
    const allTrue = jest.fn(() => false);
    const allFalse = jest.fn(() => false);
    const setAllValue = jest.fn();

    render(
      <ToggelMultipleBlocs
        allFalse={allFalse}
        allTrue={allTrue}
        setAllValue={setAllValue}
        statusBlocs={[true, false, true]}
      />
    );

    const button = screen.getByText(wording.TOUT_DEPLIER);
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(setAllValue).toHaveBeenCalledWith(true);
  });
});
