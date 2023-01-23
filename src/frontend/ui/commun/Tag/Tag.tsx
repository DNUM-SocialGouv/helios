import "@gouvfr/dsfr/dist/component/tag/tag.min.css";

export const Tag = ({ label }: { label: string }) => {
  return <p className="fr-tag">{label}</p>;
};
