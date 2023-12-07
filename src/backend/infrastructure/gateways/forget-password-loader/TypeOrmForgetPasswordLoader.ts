
import fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';


import { UtilisateurModel } from '../../../../../database/models/UtilisateurModel';
import { generateToken } from '../../../jwtHelper';
import { ForgetPasswordLoader } from '../../../métier/gateways/ForgetPasswordLoader';

export class TypeOrmForgetPasswordLoader implements ForgetPasswordLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  async forgetPassword(email: string): Promise<Object | null> {
    const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email.trim().toLowerCase() })
    if (user) {
      const APP_URL = process.env["APP_BASE_URL"]
      const token = generateToken(email, '72h')
      const absolutePath = path.resolve(process.cwd(), './public/logo-helios.png');
      // eslint-disable-next-line no-console
      console.log('absolute path', absolutePath, process.cwd());
      const imageContent = fs.readFileSync(absolutePath, 'base64');

      const html = `
          <img src="cid:logo" alt="helios" height="75" width="200">
          <p>Bonjour,</p>
          <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
      
          <p>Modifiez-le en cliquant <a href="${APP_URL}/reinitialisation-mot-passe?loginToken=${token}">ici</a> </p>
      
          <p>Si le lien de réinitialisation ne s'affiche pas, copiez et collez-le dans votre navigateur.</p>
      
          <p> <b> Ce lien reste valide pendant 72 heures après réception du mail </b>. Une erreur 404 apparaitra sur le site Helios en cas d'expiration du lien, dans ce cas, merci de cliquer sur le lien suivant :<span> <a href="${APP_URL}/mot-passe-oublie">ici</a> </span> </p>
      
          <p>Si vous ne souhaitez pas réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail.</p>
      
          <p>A bientôt sur Helios,</p>
      
          <p>En cas de difficulté dans votre demande de réinitialisation, merci de contacter l’équipe Support Helios : dnum.scn-helios-support@sg.social.gouv.fr</p>
          `
      const body = {
        to: [
          {
            address: email,
          }
        ],
        msg: {
          from: {
            personalName: process.env['TIPIMAIL_SENDER_NAME'],
            address: process.env['TIPIMAIL_SENDER_ADDRESS']
          },
          subject: "[Helios] Demande de réinitialisation de mot de passe",
          html: html,
          images: [
            {
              "contentType": "image/png",
              "filename": "logo-helios",
              "content": imageContent,
              "contentId": "logo"
            }
          ],
        }
      }

      const response = await fetch('https://api.tipimail.com/v1/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tipimail-ApiUser': process.env['TIPIMAIL_APIUSER'] || '',
          'X-Tipimail-ApiKey': process.env['TIPIMAIL_APIKEY'] || ''
        },
        body: JSON.stringify(body)
      });

      return response
    }
    else {
      return null
    }
  }

}