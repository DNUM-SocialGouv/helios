import { ChangeEventHandler, KeyboardEvent, useRef } from "react";


type SelectProps = Readonly<{
    onChangeToTable: ChangeEventHandler<HTMLInputElement>;
    onChangeToGrid: ChangeEventHandler<HTMLInputElement>;
    defaultCheckedButton: BoutonActif;
    disabled?: boolean;
}>;

export const SelecteurTableauVignette = ({ onChangeToTable, onChangeToGrid, defaultCheckedButton, disabled = false }: SelectProps) => {
    const tableauRef = useRef<HTMLInputElement>(null);
    const vignetteRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            if (defaultCheckedButton === BoutonActif.Tableau) {
                vignetteRef.current?.focus();
                vignetteRef.current?.click();
            } else {
                tableauRef.current?.focus();
                tableauRef.current?.click();
            }
        }
    };

    return (
        <fieldset className="fr-segmented fr-segmented--no-legend fr-segmented--sm" disabled={disabled}>
            <legend className="fr-segmented__legend">
                Choix d&apos;affichage en Tableau ou Vignette
            </legend>
            <div className="fr-segmented__elements">
                <div className="fr-segmented__element">
                    <input checked={defaultCheckedButton === BoutonActif.Tableau} id="display-format-table" name="display-format" onChange={onChangeToTable} onKeyDown={handleKeyDown} ref={tableauRef} tabIndex={defaultCheckedButton === BoutonActif.Tableau ? 0 : -1} type="radio" value="tableau" />
                    <label className="fr-icon-table-line fr-label" htmlFor="display-format-table">
                        Tableau
                    </label>
                </div>
                <div className="fr-segmented__element">
                    <input checked={defaultCheckedButton === BoutonActif.Vignette} id="display-format-tile" name="display-format" onChange={onChangeToGrid} onKeyDown={handleKeyDown} ref={vignetteRef} tabIndex={defaultCheckedButton === BoutonActif.Vignette ? 0 : -1} type="radio" value="vignette" />
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
