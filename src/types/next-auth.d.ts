/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User {
    nom: string;
    prenom: string;
  }

  interface Session {
    user: {
      firstname: string,
    } & DefaultSession["user"]
  }
}