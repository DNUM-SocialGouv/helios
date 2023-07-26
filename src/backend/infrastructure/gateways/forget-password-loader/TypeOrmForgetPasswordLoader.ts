
import { DataSource } from 'typeorm';

import { UtilisateurModel } from '../../../../../database/models/UtilisateurModel';
import { generateToken } from '../../../jwtHelper';
import { ForgetPasswordLoader } from '../../../métier/gateways/ForgetPasswordLoader';

export class TypeOrmForgetPasswordLoader implements ForgetPasswordLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  async forgetPassword(email: string): Promise<Object | null> {
    const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email })
    if (user) {
      const APP_URL = process.env["APP_BASE_URL"]
      const token = generateToken(email, '72h')
      const html = `
          Bonjour,
      
          <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
      
          <p>Modifiez-le en cliquant sur ce lien (valide pendant 72 heure) :</p>
      
          <p><a href="${APP_URL}/reinitialisation-mot-passe?loginToken=${token}">${APP_URL}/reinitialisation-mot-passeloginToken=${token}</a></p>
      
          <p>Si le lien de réinitialisation ne s'affiche pas, copiez et collez-le dans votre navigateur.</p>
      
          <p>Si votre lien de réinitialisation a expiré, merci de cliquer <span> <a href="${APP_URL}/mot-passe-oublie">ici</a> </span> </p>
      
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
          subject: "Demande de réinitialisation de mot de passe Helios",
          html: html

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