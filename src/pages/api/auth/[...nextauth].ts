import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  pages: {
    signIn: "/connexion"
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Helios',
      credentials: {},
      async authorize(credentials) {
        try {
          const authResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/utilisateurs/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          })

          if (!authResponse.ok) {
            throw new Error('Invalid credentials');
          }

          const { utilisateur } = await authResponse.json();

          return { ...utilisateur, id: utilisateur.code, institution: utilisateur.institution.libelle, codeRegion: utilisateur.institution.codeGeo };
        } catch (error) {
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
          codeRegion: user.codeRegion
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.idUser = token['idUser'] as string;
      session.user.firstname = token['firstname'] as string;
      session.user.role = token['role'] as string;
      session.user.institution = token['institution'] as string;
      session.user.codeRegion = token['codeRegion'] as string;
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
})