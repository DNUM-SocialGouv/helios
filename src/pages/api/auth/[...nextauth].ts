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

          return { ...utilisateur, id: utilisateur.code, };
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
          firstname: user.prenom
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.idUser = token['idUser'] as string;

      session.user.firstname = token['firstname'] as string;
      return session
    },
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
})