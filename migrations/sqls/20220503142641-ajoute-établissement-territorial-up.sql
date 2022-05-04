CREATE TABLE ÉtablissementTerritorial
(
    catégorieÉtablissement VARCHAR(255) NOT NULL,
    courriel VARCHAR(255) NOT NULL,
    ligneAcheminement VARCHAR(255) NOT NULL,
    numéroFinessEntitéJuridique VARCHAR(255) NOT NULL,
    numéroFinessÉtablissementTerritorial VARCHAR(255) NOT NULL,
    numéroVoie VARCHAR(255) NOT NULL,
    raisonSociale VARCHAR(255) NOT NULL,
    téléphone VARCHAR(255) NOT NULL,
    typeÉtablissement VARCHAR(255) NOT NULL,
    typeVoie VARCHAR(255) NOT NULL,
    voie VARCHAR(255) NOT NULL,

    CONSTRAINT établissement_territorial_pk
        PRIMARY KEY (numéroFinessÉtablissementTerritorial),

    CONSTRAINT établissement_territorial_entité_juridique_finess_fk
        FOREIGN KEY (numéroFinessEntitéJuridique)
        REFERENCES EntitéJuridique (numéroFiness)
        ON DELETE CASCADE
);
