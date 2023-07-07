import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, FormEvent, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import isEmail from '../commun/validation';


type MdpOublieState = Readonly<{
    emailValue: string;
    emailSent: boolean;
    errorMessage: string;
    isLoading: boolean;
}>;

export function useMdpOublie() {
    const router = useRouter();
    const { wording } = useDependencies();
    const [state, setState] = useState<MdpOublieState>({
        emailValue: "",
        emailSent: false,
        errorMessage: "",
        isLoading: false,
    });

    const emailValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            errorMessage : "",
            emailValue: event.target.value,
        });
    };

    const envoyerEmailService = (emailValue: string) => {
        setState({ ...state, isLoading: true })
        fetch("/api/mot-passe-oublie", {
            body: JSON.stringify({ emailValue }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.err) {
                    setState({
                        ...state,
                        emailSent: false,
                        isLoading: false,
                        errorMessage: wording.INVALID_REQUEST,
                    });
                } else {
                    setState({
                        ...state,
                        isLoading: false,
                        emailSent: true,
                    })
                }
            })
            .catch(() => {
                setState({
                    ...state,
                    emailSent: false,
                    isLoading: false,
                    errorMessage: wording.SOMETHING_WENT_WRONG,
                });
            });
    }

    const envoyerEmail = (event: FormEvent) => {
        event.preventDefault();
        if (isEmail(state.emailValue)) {
            envoyerEmailService(state.emailValue)
        } else {
            setState({...state,errorMessage : 'Email invalide'})
        }
    };

    const annuler = (event: MouseEvent) => {
        event.preventDefault();
        router.back();
    };

    const retourAccueil = (event: MouseEvent) => {
        event.preventDefault();
        router.push("/");
    };

    return {
        emailValue: state.emailValue,
        emailValueOnChange,
        envoyerEmail,
        emailSent: state.emailSent,
        annuler,
        retourAccueil,
        errorMessage: state.errorMessage,
        isLoading: state.isLoading
    }
}
