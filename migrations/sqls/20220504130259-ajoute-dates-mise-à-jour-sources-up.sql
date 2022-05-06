CREATE TYPE sourceDeDonnées AS ENUM ('FINESS');

CREATE TABLE DateMiseÀJourSource
(
    source sourceDeDonnées,
    dernièreMiseÀJour DATE NOT NULL,

    CONSTRAINT source_pk
        PRIMARY KEY (source)
);
