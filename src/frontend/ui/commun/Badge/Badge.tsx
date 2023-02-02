import "@gouvfr/dsfr/dist/component/badge/badge.min.css";

export const Badge = ({ label, className, colour }: { label: string; className?: string; colour?: string }) => {
  return <p className={"fr-badge fr-badge--no-icon fr-badge--" + colour + " " + className}>{label}</p>;
};
