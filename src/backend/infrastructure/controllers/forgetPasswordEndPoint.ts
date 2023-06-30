import { generateToken } from "../../jwtHelper";

export async function forgetPasswordEndPoint(email: string): Promise<Object> {
  try {
    const APP_URL = process.env["APP_BASE_URL"]
    const token = generateToken(email, '72h')    
    const html = `
    Bonjour,

    <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>

    <p>Modifiez-le en cliquant sur ce lien (valide pendant 72 heure) :</p>

    <p><a href="${APP_URL}/change-mot-passe?loginToken=${token}">${APP_URL}/change-mot-passe?loginToken=${token}</a></p>

    <p>Si le lien de réinitialisation ne s'affiche pas, copiez et collez-le dans votre navigateur.</p>

    <p>Si votre lien de réinitialisation a expiré, merci de cliquer <p><a href="${APP_URL}/mot-passe-oublie">Ici</a></p> </p>

    <p>Si vous ne souhaitez pas réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail.</p>

    <p>A bientôt sur Helios,</p>

    <p>En cas de difficulté dans votre demande de réinitialisation, merci de contacter l’équipe Support Helios : dnum.scn-helios-support@sg.social.gouv.fr</p>
    `
    const body = {
      "to": [
          {
              "address":email,
          }
      ],
      "msg": {
        "from": {
          "personalName": "sebastian",
          "address": "s.ferre@pmns.fr"
          },
          "subject": "Demande de réinitialisation de mot de passe Helios",
          "html": html
      
      }
  }

    const response = await fetch('https://api.tipimail.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tipimail-ApiUser': `f6da913ad5d0a1a449864c5d6f1fe70e`,
        'X-Tipimail-ApiKey':'8ff59cc5287cd5b1846a623d8f79fa7e'
      },
      body: JSON.stringify(body)
    });
    
    return response
  } catch (error) {
    return error
  }

}