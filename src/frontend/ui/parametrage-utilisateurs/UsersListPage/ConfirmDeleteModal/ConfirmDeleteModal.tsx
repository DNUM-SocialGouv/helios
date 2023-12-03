"use client";

import { memo, useCallback } from "react";

import { iPaginationData } from "../UsersListPage";

type ConfirmDeleteModalProps = Readonly<{
  paginationData: iPaginationData;
  userCode: string;
  lastElementInPage: boolean;
}>;

const ConfirmDeleteModal = ({
  paginationData: { keyWord, page, institutionId, roleId, profileId, itemsPerPage },
  userCode,
  lastElementInPage,
}: ConfirmDeleteModalProps) => {
  const deleteUser = useCallback(async (userCode: string) => {
    let keyWordData = {};
    if (keyWord) {
      keyWordData = { key: keyWord };
    }

    let pageData = {};
    if (page) {
      pageData = { page: page };

      if (lastElementInPage) {
        pageData = { page: page - 1 };
      }
    }

    let institutionIdData = {};
    if (institutionId) {
      institutionIdData = { institutionId: institutionId };
    }

    let roleIdData = {};
    if (roleId) {
      roleIdData = { roleId: roleId };
    }

    let profileIdData = {};
    if (profileId) {
      profileIdData = { profileId: profileId };
    }

    const params = {
      status: "deleted_successfully",
      ...keyWordData,
      ...pageData,
      ...institutionIdData,
      ...roleIdData,
      ...profileIdData,
      itemsPerPage: itemsPerPage.toString(),
    };

    const urlparams = new URLSearchParams(params).toString();

    await fetch("/api/utilisateurs/delete", {
      body: JSON.stringify({ userCode: userCode }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    }).then(() => {
      window.location.href = "/settings/users?" + urlparams;
    });
  }, []);

  return (
    <dialog aria-labelledby="fr-modal-2-title" className="fr-modal" id="fr-modal-2">
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <div className="fr-modal__header"></div>
              <div className="fr-modal__content">
                <h1 className="fr-modal__title" id="fr-modal-2-title">
                  Confirmation de la suppression
                </h1>
                <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
              </div>
              <div className="fr-modal__footer">
                <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                  <li>
                    <button aria-controls="fr-modal-2" className="fr-btn" onClick={() => deleteUser(userCode)}>
                      Supprimer
                    </button>
                  </li>
                  <li>
                    <button aria-controls="fr-modal-2" className="fr-btn fr-btn--secondary">
                      Annuler
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

export default memo(ConfirmDeleteModal);
