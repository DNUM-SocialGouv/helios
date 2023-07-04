import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, FormEvent, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";


type MdpOublieState = Readonly<{
    emailValue: string;
    emailSent: boolean;
    errorMessage: string;
}>;

export function useMdpOublie() {
    const router = useRouter();
    const { wording } = useDependencies();
    const [state, setState] = useState<MdpOublieState>({
        emailValue: "",
        emailSent: false,
        errorMessage: "",
    });

    const emailValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            emailValue: event.target.value,
        });
    };

    const envoyerEmailService = (emailValue: string) => {
        fetch("/api/mot-passe-oublie", {
            body: JSON.stringify({ emailValue}),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          })
          .then((response) => response.json())
          .then((data) => {
            switch (data.message) {
                case "Missing params":
                    setState({
                        ...state,
                        emailSent: false,
                        errorMessage: wording.MISSING_EMAIL,
                    });
                  break;
                  case "email not valid":
                    setState({
                        ...state,
                        emailSent: false,
                        errorMessage: wording.EMAIL_NOT_VALID,
                    });
                  break;
                case "Mail sent":
                    setState({
                        ...state,
                        emailSent: true,
                        errorMessage: "",
                    });
                    break;
                default:
                    setState({
                        ...state,
                        emailSent: true,
                    })
              }
          })
          .catch(() => {
            setState({
                ...state,
                emailSent: false,
                errorMessage: wording.SOMETHING_WENT_WRONG,
            });
          });
    }

    const envoyerEmail = (event: FormEvent) => {
        event.preventDefault();
        envoyerEmailService(state.emailValue)
    };

    const annuler = (event: MouseEvent) => {
        event.preventDefault();
        //TODO change the path 
        // the right path is back to connexion 
        router.push("/");
    };

    const retourAccueil = (event: MouseEvent) => {
        event.preventDefault();
        router.push("/");
    };

    return{
        emailValue: state.emailValue,
        emailValueOnChange, 
        envoyerEmail,
        emailSent: state.emailSent,
        annuler,
        retourAccueil,
        errorMessage: state.errorMessage,
    }
}
