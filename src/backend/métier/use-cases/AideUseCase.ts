import type { ParametrageJsonLoader } from "../gateways/ParametrageJsonLoader";

export class AideUseCase {
  constructor(private readonly aideLoader: ParametrageJsonLoader) { }

  async recupererContenu(): Promise<Record<string, unknown>> {
    return await this.aideLoader.recupererParametrage("aide");
  }

  async enregistrerContenu(contenu: Record<string, unknown>): Promise<void> {
    await this.aideLoader.enregistrerParametrage("aide", contenu);
  }
}
