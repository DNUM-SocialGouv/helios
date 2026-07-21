import { getCookie, setCookie } from "cookies-next";

export const ANALYTICS_CONSENT_COOKIE = "allowed-cookies";
export const ANALYTICS_CONSENT_CHANGED_EVENT = "helios:analytics-consent-changed";

export type AnalyticsConsentValue = "true" | "false";

export const getAnalyticsConsent = (): AnalyticsConsentValue | undefined => {
  const consent = getCookie(ANALYTICS_CONSENT_COOKIE);

  return consent === "true" || consent === "false" ? consent : undefined;
};

export const hasAnalyticsConsent = (): boolean => {
  return getAnalyticsConsent() === "true";
};

export const setAnalyticsConsent = (value: AnalyticsConsentValue): void => {
  setCookie(ANALYTICS_CONSENT_COOKIE, value);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_CHANGED_EVENT));
  }
};