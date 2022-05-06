CREATE TABLE EntitéJuridique
(
    ligneAcheminement VARCHAR(255) NOT NULL,
    numéroFinessEntitéJuridique VARCHAR(255) NOT NULL,
    numéroVoie VARCHAR(255) NOT NULL,
    raisonSociale VARCHAR(255) NOT NULL,
    statutJuridique VARCHAR(255) NOT NULL,
    téléphone VARCHAR(255) NOT NULL,
    typeVoie VARCHAR(255) NOT NULL,
    voie VARCHAR(255) NOT NULL,

    CONSTRAINT entité_juridique_pk PRIMARY KEY (numéroFinessEntitéJuridique)
);
