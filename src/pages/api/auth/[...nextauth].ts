import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { dependencies } from "../../../backend/infrastructure/dependencies";

const { utilisateurLoader } = dependencies;

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/connexion",
  },
  providers: [
    {
      id: "proconnect",
      name: "ProConnect",
      clientId: process.env['PROCONNECT_CLIENTID'],
      clientSecret: process.env['PROCONNECT_CLIENT_SECRET'],
      type: "oauth",
      //wellKnown: "http://localhost:8080/realms/Helios/.well-known/openid-configuration",
      wellKnown: process.env['PROCONNECT_WELLKNOWN'],
      authorization: { params: { scope: "openid email profile" } },
      checks: ["pkce", "state"],
      idToken: true,
      async profile(profile) {
        // Check if the user exists
        let utilisateur = await utilisateurLoader.getUserByEmail(profile.email);

        //Create the user if it doesn't exist
        if (!utilisateur) {
          // TODO: Ajouter une institution par défaut si l’utilisateur n’a pas l’information sur son ARS retourné.
          utilisateur = await utilisateurLoader.createUser(profile.given_name, profile.family_name, profile.email, profile.organizational_unit || "ARS_04");
        }
        if (!utilisateur) {
          throw new Error("User creation failed");
        }

        return {
          ...utilisateur,
          id: String(utilisateur?.id),
          codeRegion: utilisateur.institution.codeGeo,
          codeProfiles: utilisateur.profils,
        }
      },
    },
    CredentialsProvider({
      id: "credentials",
      name: "Helios",
      credentials: {},
      async authorize(credentials) {
        try {
          const authResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/utilisateurs/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!authResponse.ok) {
            throw new Error("Invalid credentials");
          }

          const { utilisateur } = await authResponse.json();
          return {
            ...utilisateur,
            id: utilisateur.code,
            institution: utilisateur.institution.libelle,
            institutionId: utilisateur.institution.id,
            codeRegion: utilisateur.institution.codeGeo,
            codeProfiles: utilisateur.profils,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  secret: process.env["NEXTAUTH_SECRET"],
  callbacks: {
    async jwt({ token, user, account }) {
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
