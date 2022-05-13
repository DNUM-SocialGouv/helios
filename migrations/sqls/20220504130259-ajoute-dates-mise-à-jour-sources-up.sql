CREATE TYPE sourceDeDonnées AS ENUM ('FINESS');

CREATE TABLE DateMiseÀJourSource
(
    dernièreMiseÀJour DATE NOT NULL,
    source sourceDeDonnées,

    CONSTRAINT source_primary_key
        PRIMARY KEY (source)
);

SET TIMEZONE='Europe/Paris';