/* eslint-disable no-console */

import dotenv from "dotenv-defaults";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import Client from "ssh2-sftp-client";

/*interface SFTPDownloadParams {
  sourceFolderPath: string;
  sourceFileName: string;
  destinationFolderPath: string;
  destinationFileName: string;
}*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const { sourceFolderPath, sourceFileName, destinationFolderPath, destinationFileName }: SFTPDownloadParams = req.body;

  const sourceFolderPath = "";
  const sourceFileName = "";
  const destinationFolderPath = "";
  const destinationFileName = "";

  dotenv.config();
  const { FTP_HOST, FTP_PORT, FTP_PRIVATE_KEY, FTP_USERNAME } = process.env;

  const sftp = new Client();

  try {
    console.log("Tentative de connexion au serveur SFTP...");
    await sftp.connect({
      host: FTP_HOST!,
      port: parseInt(FTP_PORT!),
      username: FTP_USERNAME!,
      privateKey: fs.readFileSync(FTP_PRIVATE_KEY!),
    });
    console.log("Connexion réussie au serveur SFTP.");
  } catch (err) {
    console.error(`Une erreur s'est produite lors de la connexion au serveur SFTP : ${err.message}`);
    res.status(500).json({ error: `Une erreur s'est produite lors de la connexion au serveur SFTP : ${err.message}` });
  } finally {
    await sftp.end();
    console.log("Déconnexion du serveur SFTP.");
  }

  try {
    console.log(`Téléchargement du fichier ${sourceFileName} depuis ${sourceFolderPath}...`);
    await sftp.get(`${sourceFolderPath}/${sourceFileName}`, `${destinationFolderPath}/${destinationFileName}`);
    console.log("Fichier téléchargé avec succès.");
  } catch (downloadError) {
    console.error(`Erreur lors du téléchargement du fichier : ${downloadError.message}`);
    throw downloadError;
  } finally {
    await sftp.end();
    console.log("Déconnexion du serveur SFTP.");
  }

  console.log(
    `Le fichier ${sourceFileName} a été téléchargé depuis ${sourceFolderPath} et placé dans ${destinationFolderPath} avec le nom ${destinationFileName}.`
  );

  res.status(200).json({ message: `Le fichier ${sourceFileName} a été téléchargé et placé dans ${destinationFolderPath} avec le nom ${destinationFileName}.` });
}
