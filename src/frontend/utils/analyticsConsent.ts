import { push as matomoPush } from "@socialgouv/matomo-next";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const ANALYTICS_CONSENT_COOKIE = "allowed-cookies";
export const ANALYTICS_CONSENT_CHANGED_EVENT = "helios:analytics-consent-changed";

const MATOMO_COOKIE_PREFIXES = ["_pk_id", "_pk_ref", "_pk_ses", "_pk_cvar", "_pk_hsr"];

export type AnalyticsConsentValue = "true" | "false";

const deleteBrowserCookie = (cookieName: string): void => {
  deleteCookie(cookieName);

  if (typeof window === "undefined") {
    return;
  }

  const hostname = window.location.hostname;
  const domains = [undefined, hostname, hostname.startsWith(".") ? hostname : `.${hostname}`];

  domains.forEach((domain) => {
    document.cookie = `${cookieName}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
  });
};

export const deleteMatomoCookies = (): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((cookieName) => MATOMO_COOKIE_PREFIXES.some((prefix) => cookieName.startsWith(prefix)))
    .forEach(deleteBrowserCookie);
};

export const applyMatomoConsent = (value: AnalyticsConsentValue): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (value === "true") {
    matomoPush(["forgetUserOptOut"]);
    matomoPush(["trackPageView"]);
    return;
  }

  matomoPush(["optUserOut"]);
  deleteMatomoCookies();
};

export const getAnalyticsConsent = (): AnalyticsConsentValue | undefined => {
  const consent = getCookie(ANALYTICS_CONSENT_COOKIE);

  return consent === "true" || consent === "false" ? consent : undefined;
};

export const hasAnalyticsConsent = (): boolean => {
  return getAnalyticsConsent() === "true";
};

export const setAnalyticsConsent = (value: AnalyticsConsentValue): void => {
  const previousConsent = getAnalyticsConsent();

  setCookie(ANALYTICS_CONSENT_COOKIE, value);
  applyMatomoConsent(value);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_CHANGED_EVENT));

    if (previousConsent === "false" && value === "true") {
      window.location.reload();
    }
  }
};
