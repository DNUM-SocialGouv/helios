import NextAuth, { NextAuthOptions } from "next-auth";

import { dependencies } from "../../../backend/infrastructure/dependencies";

const { utilisateurLoader } = dependencies;

const proConnectIssuer = process.env["PROCONNECT_ISSUER"];
export const proConnectWellKnown = process.env["PROCONNECT_WELLKNOWN"] ?? (proConnectIssuer ? `${proConnectIssuer.replace(/\/$/, "")}/.well-known/openid-configuration` : undefined);

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/connexion",
  },
  providers: [
     {
      id: "proconnect",
      name: "ProConnect",
      clientId: process.env["PROCONNECT_CLIENT_ID"] ?? process.env["PROCONNECT_CLIENTID"],
      clientSecret: process.env["PROCONNECT_CLIENT_SECRET"],
      type: "oauth",
      wellKnown: proConnectWellKnown,
      authorization: { params: { scope: "openid email given_name usual_name uid organization_label organizational_unit" } },
      checks: ["pkce", "state", "nonce"],
      idToken: true,
      // ProConnect returns user claims only from the userinfo endpoint, as a signed JWT
      client: {
        id_token_signed_response_alg: "RS256",
        userinfo_signed_response_alg: "RS256",
      },
      userinfo: {
        async request({ tokens, client }) {
          return await client.userinfo(tokens.access_token as string);
        },
      },
      async profile(profile) {
        if (!profile.email) {
          throw new Error("ProConnect profile has no email");
        }
        // Check if the user exists
        let utilisateur = await utilisateurLoader.getUserByEmail(profile.email);

        //Create the user if it doesn't exist
        if (!utilisateur) {
          // TODO: Ajouter une institution par défaut si l’utilisateur n’a pas l’information sur son ARS retourné.
          utilisateur = await utilisateurLoader.createUser(profile.given_name, profile.usual_name, profile.email, profile.organizational_unit || "ARS_04");
        }
        if (!utilisateur) {
          throw new Error("User creation failed");
        }

        return {
            ...utilisateur,
            id: utilisateur.code,
            institution: utilisateur.institution.libelle,
            institutionId: utilisateur.institution.id,
            codeRegion: utilisateur.institution.codeGeo,
            codeProfiles: utilisateur.profils,
            cgu: utilisateur.cgu,
        }
      },
    },
  ],
  secret: process.env["NEXTAUTH_SECRET"],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account && user) {
        return {
          ...token,
          name: user.nom,
          idUser: user.code,
          firstname: user.prenom,
          role: user.roleId,
          institution: user.institution,
          institutionId: user.institutionId,
          codeRegion: user.codeRegion,
          codeProfiles: user.codeProfiles,
          cgu: user.cgu,
          provider: account.provider,
          idToken: account.id_token,
        };
      }
      if (trigger === "update" && typeof session?.cgu === "boolean") {
        return {
          ...token,
          cgu: session.cgu,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.idUser = token["idUser"] as string;
      session.user.firstname = token["firstname"] as string;
      session.user.role = token["role"] as number;
      session.user.institution = token["institution"] as string;
      session.user.institutionId = token["institutionId"] as number;
      session.user.codeRegion = token["codeRegion"] as number;
      session.user.codeProfiles = token["codeProfiles"] as string[];
      session.user.cgu = token["cgu"] as boolean;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60,
  },
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "", // Hex color code #33FF5D
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions);
