import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/connexion",
  },
  providers: [
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
        } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return null ». Aucune autre action à faire ici
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
