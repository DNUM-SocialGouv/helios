import { push as matomoPush } from "@socialgouv/matomo-next";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  ANALYTICS_CONSENT_COOKIE,
  applyMatomoConsent,
  getAnalyticsConsent,
  hasAnalyticsConsent,
  setAnalyticsConsent,
} from "./analyticsConsent";

jest.mock<typeof import("@socialgouv/matomo-next")>("@socialgouv/matomo-next", () => ({
  ...jest.requireActual<typeof import("@socialgouv/matomo-next")>("@socialgouv/matomo-next"),
  push: jest.fn(),
}));

jest.mock<typeof import("cookies-next")>("cookies-next", () => ({
  ...jest.requireActual<typeof import("cookies-next")>("cookies-next"),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}));

describe("analyticsConsent", () => {
  beforeEach(() => {
    document.cookie = "_pk_id.1=matomo-id";
  });

  it("lit uniquement les valeurs de consentement valides", () => {
    jest.mocked(getCookie).mockReturnValue("true");

    expect(getAnalyticsConsent()).toBe("true");
    expect(hasAnalyticsConsent()).toBe(true);

    jest.mocked(getCookie).mockReturnValue("unexpected");

    expect(getAnalyticsConsent()).toBeUndefined();
  });

  it("applique le refus Matomo et supprime les cookies Matomo", () => {
    applyMatomoConsent("false");

    expect(matomoPush).toHaveBeenCalledWith(["optUserOut"]);
    expect(deleteCookie).toHaveBeenCalledWith("_pk_id.1");
  });

  it("mémorise le consentement Matomo quand les cookies sont acceptés", () => {
    applyMatomoConsent("true");

    expect(matomoPush).toHaveBeenCalledWith(["forgetUserOptOut"]);
    expect(matomoPush).toHaveBeenCalledWith(["trackPageView"]);
    expect(matomoPush).not.toHaveBeenCalledWith(["optUserOut"]);
  });

  it("notifie le changement après avoir appliqué le consentement", () => {
    const listener = jest.fn();
    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, listener);

    setAnalyticsConsent("false");

    expect(setCookie).toHaveBeenCalledWith(ANALYTICS_CONSENT_COOKIE, "false");
    expect(matomoPush).toHaveBeenCalledWith(["optUserOut"]);
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, listener);
  });
});