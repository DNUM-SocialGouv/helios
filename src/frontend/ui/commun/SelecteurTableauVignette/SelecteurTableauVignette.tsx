import { ChangeEventHandler } from "react";


type SelectProps = Readonly<{
    onChangeToTable: ChangeEventHandler<HTMLInputElement>;
    onChangeToGrid: ChangeEventHandler<HTMLInputElement>;
    defaultCheckedButton: BoutonActif;
    disabled?: boolean;
}>;

export const SelecteurTableauVignette = ({ onChangeToTable, onChangeToGrid, defaultCheckedButton, disabled = false }: SelectProps) => {
    return (
        <fieldset className="fr-segmented fr-segmented--no-legend fr-segmented--sm" disabled={disabled}>
            <legend className="fr-segmented__legend">
                Choix d’affichage en Tableau ou Vignette
            </legend>
            <div className="fr-segmented__elements">
                <div className="fr-segmented__element">
                    <input defaultChecked={defaultCheckedButton === BoutonActif.Tableau} id="display-format-table" name="display-format" onChange={onChangeToTable} type="radio" value="tableau" />
                    <label className="fr-icon-table-line fr-label" htmlFor="display-format-table">
                        Tableau
                    </label>
                </div>
                <div className="fr-segmented__element">
                    <input defaultChecked={defaultCheckedButton === BoutonActif.Vignette} id="display-format-tile" name="display-format" onChange={onChangeToGrid} type="radio" value="vignette" />
                    <label className="fr-icon-layout-grid-line fr-label" htmlFor="display-format-tile">
                        Vignette
                    </label>
                </div>
            </div>
        </fieldset>
    );
};

export enum BoutonActif {
    Tableau,
    Vignette
}