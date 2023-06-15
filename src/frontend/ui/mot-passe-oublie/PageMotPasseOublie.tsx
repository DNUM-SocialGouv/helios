import { FormulaireMdpOublie } from "./FormulaireMdpOublie";
import { useMdpOublie } from "./useMdpOublie";

export const PageMotPasseOublie = () => {

  const {
    emailValue,
    emailValueOnChange, 
    envoyerEmail,
    emailSent,
    annuler,
    retourAccueil,
    errorMessage,
  } = useMdpOublie();

  return (
      <FormulaireMdpOublie emailValue={emailValue} emailValueOnChange={emailValueOnChange} envoyerEmail={envoyerEmail} annuler={annuler} emailSent={emailSent} retourAccueil={retourAccueil} errorMessage={errorMessage} />
  );
};
