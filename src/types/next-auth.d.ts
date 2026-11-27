/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    nom: string;
    code: string;
    prenom: string;
    roleId: string;
    institution: string;
    institutionId: number;
    codeRegion: string;
    codeProfiles: string[];
    cgu: boolean;
  }

  interface Session {
    user: {
      idUser: string;
      firstname: string;
      role: number;
      codeRegion: number;
      codeProfiles: string[];
      institution: string;
      institutionId: number;
      cgu: boolean;
    } & DefaultSession["user"];
  }
}
