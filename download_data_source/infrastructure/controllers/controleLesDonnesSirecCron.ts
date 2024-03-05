import { ControleLesDonnesSirecsUseCase } from "../../métier/use-cases/ControleLesDonnesSirecsUseCase";
import { dependencies, Dependencies } from "../dependencies";

async function controleLesDonnesSirecCron(dependencies: Dependencies) {
    const controleLesDonnesSirecsUseCase = new ControleLesDonnesSirecsUseCase(
        dependencies.controleDonneesSirecLoader
    );

    await controleLesDonnesSirecsUseCase.execute();
    setTimeout(() => process.exit(0), dependencies.DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS);
}
controleLesDonnesSirecCron(dependencies);
