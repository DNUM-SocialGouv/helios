/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User {
    nom: string;
    prenom: string;
    roleId: string;
    institution: object;
  }

  interface Session {
    user: {
      firstname: string,
      role: string,
      institution,
    } & DefaultSession["user"]
  }
}