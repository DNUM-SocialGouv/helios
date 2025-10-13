export interface ParametrageJsonLoader {
  recupererParametrage(slug: string): Promise<Record<string, unknown>>;
  enregistrerParametrage(slug: string, contenu: Record<string, unknown>): Promise<void>;
}
