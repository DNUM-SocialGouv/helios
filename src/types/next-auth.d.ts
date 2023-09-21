/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User {
    nom: string;
    code: string;
    prenom: string;
    roleId: string;
    institution: object;
    codeRegion: string;
    codeProfiles: string[];
  }

  interface Session {
    user: {
      idUser: string,
      firstname: string,
      role: string,
      codeRegion: string,
      codeProfiles: string[],
      institution,
    } & DefaultSession["user"]
  }
}