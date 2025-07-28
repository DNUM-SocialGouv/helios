import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";

export type PasswordCriteria = {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
}

const defaultCriteria: PasswordCriteria = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
};

export function useChangeMdp() {
    const router = useRouter();
    const { wording } = useDependencies();

    const [oldPasswordValue, setOldPasswordValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [updated, setUpdated] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [criteriaNewPassword, setCriteriaNewPassword] = useState(defaultCriteria);

    const criteria = (password: string) => {
        return {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[!@#$%^&*]/.test(password),
        };
    }

    const { data } = useSession();

    const annuler = (event: MouseEvent) => {
        event.preventDefault();
        router.push("/");
    };

    const oldPasswordValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOldPasswordValue(event.target.value);
    }

    const passwordValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.target.value);
        setCriteriaNewPassword(criteria(event.target.value))
    }

    const confirmPasswordValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordValue(event.target.value);
    }

    const changePassword = (event: FormEvent) => {
        event.preventDefault();
        if (passwordValue !== confirmPasswordValue) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
        }
        else {
            changePasswordService();
        }
    }

    const changePasswordService = () => {
        setIsLoading(true)
        fetch("/api/update-password", {
            body: JSON.stringify({ email: data?.user?.email, password: passwordValue, oldPassword: oldPasswordValue }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then(async (response) => {
                setIsLoading(false)
                const data = await response.json();

                if (response.status === 200) {
                    setUpdated(true);
                    setErrorMessage("");
                }
                if (response.status === 400) {
                    setUpdated(false);
                    if (data.err === "wrong old password") {
                        setErrorMessage(wording.WRONG_OLD_MOT_DE_PASSE);
                    } else {
                        if (data.err === "The password must be different from the current password") {
                            setErrorMessage(wording.DIFFERENT_MOT_PASSE);
                        } else {
                            setErrorMessage(wording.INVALID_REQUEST);
                        }
                    }
                }
            })
            .catch(() => {
                setUpdated(false);
                setIsLoading(false)
                setErrorMessage(wording.SOMETHING_WENT_WRONG);
            });
    }

    const checkTokenService = async (token: string) => {
        fetch("/api/check-token", {
            body: JSON.stringify({ token }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                setIsChecking(false);
                if (data.info.email) {
                    setValidToken(true);
                }
            })
            .catch(() => {
                setIsChecking(false);
                setValidToken(false);
            });
    }


    return {
        passwordValue,
        confirmPasswordValue,
        oldPasswordValue,
        validToken,
        isChecking,
        changePassword,
        passwordValueOnChange,
        oldPasswordValueOnChange,
        confirmPasswordValueOnChange,
        annuler,
        checkTokenService,
        errorMessage,
        updated,
        isLoading,
        criteriaNewPassword,
    }
}