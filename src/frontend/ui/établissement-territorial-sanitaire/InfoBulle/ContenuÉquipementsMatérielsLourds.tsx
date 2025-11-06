import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuÉquipementsMatérielsLourdsProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
  estEntitéJuridique?: boolean;
}>;

export const ContenuÉquipementsMatérielsLourds = ({ dateDeMiseÀJour, source, estEntitéJuridique = false }: ContenuÉquipementsMatérielsLourdsProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Une autorisation d’équipement matériel lourd est une décision administrative,
          délivrée par arrêté du Directeur général de l’Agence régionale de santé,
          permettant à un établissement de santé d’installer un tel équipement (IRM, Scanner, etc.) conformément aux conditions d’implantation et de fonctionnement prévues dans le Code de la santé publique.
        </p>
        <p>
          Dans le domaine sanitaire, les autorisations sont délivrées à une entité juridique pour une mise en œuvre au sein d’un établissement géographique. Seules les autorisations mises en œuvre sont actuellement affichées.
        </p>
        <p>
          Dans le cadre de la réforme des autorisations intervenue en 2023, le format des autorisations a évolué :
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;Avant la réforme les autorisations étaient composées de trois niveaux : Activité / Modalité / Forme.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;Après la réforme les autorisations sont désormais composées de cinq niveaux : Activité / Modalité / Mention / Pratique thérapeutique spécifique / Déclaration.
        </p>
        <p>La transition vers ce nouveau format s’effectue progressivement au fil des renouvellements d’autorisations. Aussi, les deux formats peuvent temporairement coexister.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Hebdomadaire
        </p>
      </section>
      {estEntitéJuridique && (
        <section aria-label={wording.MODE_DE_CALCUL}>
          <p>
            <span className="fr-text--bold">Mode de calcul :</span> Les EML affichés au niveau de l’entité juridique (EJ) correspondent à l’ensemble des autorisations des établissements géographiques sanitaires rattachés à l’EJ.
          </p>
        </section>
      )}
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> SI-Autorisations - Fichier National des Établissements Sanitaires et Sociaux (FINESS)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Ces données prennent leur source dans le SI-Autorisations et sont reprises dans le fichier national des établissements sanitaires et sociaux (FINESS).
          <br />
          SI-Autorisations est l’outil de gestion des autorisations des activités de soins et des équipements matériels lourds (EML) pour les établissements sanitaires.
        </p>
      </section>
    </>
  );
};
