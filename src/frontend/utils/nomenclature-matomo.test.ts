import { push as matomoPush, sendEvent as matomoSendEvent } from "@socialgouv/matomo-next";

import { hasAnalyticsConsent } from "./analyticsConsent";
import { push, sendEvent } from "./nomenclature-matomo";

jest.mock<typeof import("@socialgouv/matomo-next")>("@socialgouv/matomo-next", () => ({
  ...jest.requireActual<typeof import("@socialgouv/matomo-next")>("@socialgouv/matomo-next"),
  push: jest.fn(),
  sendEvent: jest.fn(),
}));

jest.mock<typeof import("./analyticsConsent")>("./analyticsConsent", () => ({
  ...jest.requireActual<typeof import("./analyticsConsent")>("./analyticsConsent"),
  hasAnalyticsConsent: jest.fn(),
}));

describe("nomenclature-matomo", () => {
  beforeEach(() => {
    process.env["NEXT_PUBLIC_MATOMO_ENABLED"] = "true";
  });

  it("bloque les événements Matomo sans consentement", () => {
    jest.mocked(hasAnalyticsConsent).mockReturnValue(false);

    sendEvent({ category: "navigation", action: "aide" });
    push(["setCustomDimension", 1, "regional"]);

    expect(matomoSendEvent).not.toHaveBeenCalled();
    expect(matomoPush).not.toHaveBeenCalled();
  });

  it("envoie les événements Matomo avec consentement", () => {
    jest.mocked(hasAnalyticsConsent).mockReturnValue(true);

    sendEvent({ category: "navigation", action: "aide" });
    push(["setCustomDimension", 1, "regional"]);

    expect(matomoSendEvent).toHaveBeenCalledWith({ category: "navigation", action: "aide" });
    expect(matomoPush).toHaveBeenCalledWith(["setCustomDimension", 1, "regional"]);
  });
});