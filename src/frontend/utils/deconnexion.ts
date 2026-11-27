import { signOut } from "next-auth/react";

async function getProConnectLogoutUrl(): Promise<string | null> {
  try {
    const response = await fetch("/api/proconnect/logout");
    if (!response.ok) return null;
    const body = (await response.json()) as { url?: string | null } | undefined;
    return body?.url ?? null;
  } catch {
    return null;
  }
}

// The ProConnect logout URL must be fetched before signOut, since it needs the id_token stored in the session
export async function seDeconnecter(callbackUrl: string): Promise<void> {
  const proConnectLogoutUrl = await getProConnectLogoutUrl();
  if (proConnectLogoutUrl) {
    await signOut({ redirect: false });
    window.location.assign(proConnectLogoutUrl);
  } else {
    await signOut({ callbackUrl });
  }
}
