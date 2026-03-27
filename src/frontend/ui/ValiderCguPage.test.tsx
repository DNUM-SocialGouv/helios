import { fireEvent, screen, waitFor } from "@testing-library/react";
import { signOut, useSession } from "next-auth/react";
import mockRouter from "next-router-mock";

import ValiderCguPage from "../../pages/valider-cgu";
import { renderFakeComponent } from "../test-helpers/testHelper";

jest.mock("next-auth/react", (): typeof import("next-auth/react") => ({
  ...jest.requireActual("next-auth/react"),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

describe("Page CGU", () => {
  let updateSessionMock: jest.Mock;

  beforeEach(() => {
    // @ts-expect-error test mock
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      json: jest.fn(),
      ok: true,
    });
    updateSessionMock = jest.fn().mockResolvedValue(undefined);
    jest.mocked(useSession).mockReturnValue({ update: updateSessionMock, data: null, status: "loading" });
    mockRouter.push("/cgu");
  });

  it("accepte les CGU, met à jour la session et redirige vers l’accueil", async () => {
    renderFakeComponent(<ValiderCguPage />);

    fireEvent.click(screen.getByRole("button", { name: "Accepter" }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/utilisateurs/cgu", {
        body: JSON.stringify({ accepted: true }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    });
    await waitFor(() => {
      expect(updateSessionMock).toHaveBeenCalledWith({ cgu: true });
    });
    await waitFor(() => {
      expect(mockRouter.pathname).toBe("/");
    });
  });

  it("refuse les CGU et déclenche la déconnexion vers l’accueil", async () => {
    renderFakeComponent(<ValiderCguPage />);

    fireEvent.click(screen.getByRole("button", { name: "Refuser" }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });
  });
});
