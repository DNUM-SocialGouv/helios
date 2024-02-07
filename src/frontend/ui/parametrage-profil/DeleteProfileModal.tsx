import { useRouter } from "next/router";
import { memo, useCallback } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";

type DeleteProfileModalProps = Readonly<{
    profileId: number;
}>;

const DeleteProfileModal = (
    { profileId }: DeleteProfileModalProps
) => {
    const { paths } = useDependencies();

    const router = useRouter();

    const deleteProfile = useCallback(
        async (profileId: number) => {
            await fetch("/api/profile/delete", {
                body: JSON.stringify({ profileId: profileId }),
                headers: { "Content-Type": "application/json" },
                method: "DELETE",
            }).then(async () => {
                router.push(paths.PROFILES_LIST);
            });
        },
        [profileId]
    );

    return (
        <dialog aria-labelledby="fr-modal-delete-profile-title" className="fr-modal" id="fr-modal-delete-profile">
            <div className="fr-container fr-container--fluid fr-container-md">
                <div className="fr-grid-row fr-grid-row--center">
                    <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
                        <div className="fr-modal__body">
                            <div className="fr-modal__header"></div>
                            <div className="fr-modal__content">
                                <h1 className="fr-modal__title" id="fr-modal-delete-profile-title">
                                    Confirmation de la suppression
                                </h1>
                                <p>La suppression définitive d&apos;une autorisation peut impacter les comptes utilisateurs rattachés
                                    à cette autorisation.
                                </p>
                                <p>Êtes-vous sûr de vouloir supprimer cette autorisation ?</p>
                            </div>
                            <div className="fr-modal__footer">
                                <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                                    <li>
                                        <button aria-controls="fr-modal-delete-profile" className="fr-btn fr-btn--secondary">
                                            Annuler
                                        </button>
                                    </li>
                                    <li>
                                        <button aria-controls="fr-modal-delete-profile" className="fr-btn"
                                            onClick={() => deleteProfile(profileId)}
                                        >
                                            Oui
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default memo(DeleteProfileModal);
