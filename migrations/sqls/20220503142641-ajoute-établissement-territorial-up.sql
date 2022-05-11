CREATE TABLE ÉtablissementTerritorial
(
    adresseAcheminement VARCHAR(255) NOT NULL,
    adresseNuméroVoie VARCHAR(255) NOT NULL,
    adresseTypeVoie VARCHAR(255) NOT NULL,
    adresseVoie VARCHAR(255) NOT NULL,
    catégorieÉtablissement VARCHAR(255) NOT NULL,
    courriel VARCHAR(255) NOT NULL,
    numéroFinessEntitéJuridique VARCHAR(255) NOT NULL,
    numéroFinessÉtablissementPrincipal VARCHAR(255) NOT NULL,
    numéroFinessÉtablissementTerritorial VARCHAR(255) NOT NULL,
    raisonSociale VARCHAR(255) NOT NULL,
    téléphone VARCHAR(255) NOT NULL,
    typeÉtablissement VARCHAR(255) NOT NULL,

    CONSTRAINT établissement_territorial_primary_key
        PRIMARY KEY (numéroFinessÉtablissementTerritorial),

    CONSTRAINT établissement_territorial_entité_juridique_finess_foreign_key
        FOREIGN KEY (numéroFinessEntitéJuridique)
        REFERENCES EntitéJuridique (numéroFinessEntitéJuridique)
        ON DELETE CASCADE
);
