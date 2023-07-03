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
    <FormulaireMdpOublie annuler={annuler} emailSent={emailSent} emailValue={emailValue} emailValueOnChange={emailValueOnChange} envoyerEmail={envoyerEmail} errorMessage={errorMessage} retourAccueil={retourAccueil}/>
  );
};
