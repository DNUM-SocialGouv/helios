import { generateToken } from "../../jwtHelper";

const nodemailer = require("nodemailer");

export async function forgetPasswordEndPoint(email:string) :Promise<Object> {
  console.log('7845');
  
    try {
      console.log('after ...');
      const APP_URL = '/localhost:3000'
      const token  =generateToken(email,'72h')
      console.log( 'token',token)

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
    const transporter = nodemailer.createTransport({
        host:"smtp.forwardemail.net",
        port:465,
        secure:true,
        auth: {
             user :'s.ferre@cat-amania.com',
             pass:`7XG^x}7'tWe4pA.`
        }
    })
    return  await transporter.sendMail({
        from: 's.ferre@cat-amania.com', 
        to: email, 
        subject: "Demande de réinitialisation de mot de passe Helios", // Subject line
        html: html,
      });
    } catch (error) {
        return error
    }

}