const ConfirmDeleteListModal = ({ deleteList }: { deleteList: () => void }) => {
    return (
        <dialog aria-labelledby="fr-modal-2-title" className="fr-modal" id="fr-modal-2">
            <div className="fr-container fr-container--fluid fr-container-md">
                <div className="fr-grid-row fr-grid-row--center">
                    <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
                        <div className="fr-modal__body">
                            <div className="fr-modal__header"></div>
                            <div className="fr-modal__content">
                                <h1 className="fr-modal__title" id="fr-modal-2-title">
                                    Souhaitez-vous confirmer la suppression de la liste ?
                                </h1>
                            </div>
                            <div className="fr-modal__footer">
                                <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                                    <li>
                                        <button aria-controls="fr-modal-2" className="fr-btn fr-btn--secondary">
                                            Annuler
                                        </button>
                                    </li>
                                    <li>
                                        <button aria-controls="fr-modal-2" className="fr-btn" onClick={deleteList}>
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
    )
}

export default ConfirmDeleteListModal;