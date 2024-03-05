import { HeliosError } from "../../infrastructure/HeliosError";
import { ControleDonneesSirecLoader } from "../gateways/ControleDonnesSirecLoader";

export class ControleLesDonnesSirecsUseCase {
    constructor(
        private readonly controleDonneesSirecLoader: ControleDonneesSirecLoader,
    ) { }

    async execute(): Promise<void> {
        try {
            this.controleDonneesSirecLoader.checkDowloadedSirecFile()
        } catch (error) {
            throw new HeliosError(error.message);
        }
    }
}