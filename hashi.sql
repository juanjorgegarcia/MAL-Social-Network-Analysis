DROP DATABASE IF EXISTS malDatabase;
CREATE DATABASE malDatabase;
USE malDatabase;

CREATE TABLE Animes (
    idAnime INT NOT NULL ,
    title VARCHAR(100) NOT NULL UNIQUE,
    animeType VARCHAR(30) NOT NULL,
    derivedFrom VARCHAR(100) NOT NULL,
    numberEpisodes INT,
    airStatus VARCHAR(100),
    airing TINYINT(1) NOT NULL,
    animeStart  DATETIME,
    animeFinish  DATETIME,
    duration VARCHAR(100),
    rating VARCHAR(100),
    score DECIMAL(10,2),
    scored_by INT,
    animeRank INT ,
    popularity INT ,
    members INT,
    favorites INT,
    premiered VARCHAR(100),
    broadcast VARCHAR(100),
    synopsis VARCHAR(2000),
    PRIMARY KEY (idAnime)
);

CREATE TABLE Mangas (
    idManga INT NOT NULL ,
    title VARCHAR(100) NOT NULL UNIQUE,
    mangaType VARCHAR(30) NOT NULL,
    volumes INT,
    chapters INT,
    publishing TINYINT(1) NOT NULL,
    mangaStart DATETIME,
    mangaFinish DATETIME,
    mangaRank INT ,
    score DECIMAL(10,2),
    scored_by INT,
    popularity INT ,
    members INT,
    favorites INT,
    synopsis VARCHAR(2000),
    PRIMARY KEY (idManga)
);

CREATE TABLE animeManga (
    idAnime INT NOT NULL,
    idManga INT NOT NULL,
    PRIMARY KEY (idManga, idAnime),
    FOREIGN KEY (idManga) REFERENCES Mangas (idManga),
    FOREIGN KEY (idAnime) REFERENCES Animes (idAnime)
);

CREATE TABLE Author (
    idAuthor INT NOT NULL,
    authorType VARCHAR(100),
    authorName VARCHAR(100) UNIQUE,
    PRIMARY KEY (idAuthor)
);

CREATE TABLE mangaAuthor (
    idManga INT NOT NULL,
    idAuthor INT NOT NULL,
    PRIMARY KEY (idManga, idAuthor),
    FOREIGN KEY (idManga) REFERENCES Mangas (idManga),
    FOREIGN KEY (idAuthor) REFERENCES Author (idAuthor)
);

CREATE TABLE Magazines (
    idMagazine INT NOT NULL,
    magazineType VARCHAR(100),
    magazineName VARCHAR(100) UNIQUE,
    PRIMARY KEY (idMagazine)
);

CREATE TABLE mangaMagazine (
    idManga INT NOT NULL,
    idMagazine INT NOT NULL,
    PRIMARY KEY (idManga, idMagazine),
    FOREIGN KEY (idManga) REFERENCES Mangas (idManga),
    FOREIGN KEY (idMagazine) REFERENCES Magazines (idMagazine)
);

CREATE TABLE Producers (
    idProducer INT NOT NULL ,
    producerType VARCHAR(100),
    producerName VARCHAR(100) UNIQUE,
    PRIMARY KEY (idProducer)
);

CREATE TABLE animeProducer (
    idAnime INT NOT NULL,
    idProducer INT NOT NULL,
    PRIMARY KEY (idAnime, idProducer),
    FOREIGN KEY (idAnime) REFERENCES Animes (idAnime),
    FOREIGN KEY (idProducer) REFERENCES Producers (idProducer)
);

CREATE TABLE Licensors (
    idLicensor INT NOT NULL,
    licensorType VARCHAR(100),
    licensorName VARCHAR(100) UNIQUE,
    PRIMARY KEY (idLicensor)
);

CREATE TABLE animeLicensor (
    idAnime INT NOT NULL,
    idLicensor INT NOT NULL,
    PRIMARY KEY (idAnime, idLicensor),
    FOREIGN KEY (idAnime) REFERENCES Animes (idAnime),
    FOREIGN KEY (idLicensor) REFERENCES Licensors (idLicensor)
);

CREATE TABLE Studios (
    idStudio INT NOT NULL ,
    studioType VARCHAR(100),
    studioName VARCHAR(100) UNIQUE,
    PRIMARY KEY (idStudio)
);

CREATE TABLE animeStudio (
    idAnime INT NOT NULL,
    idStudio INT NOT NULL,
    PRIMARY KEY (idAnime, idStudio),
    FOREIGN KEY (idAnime) REFERENCES Animes (idAnime),
    FOREIGN KEY (idStudio) REFERENCES Studios (idStudio)
);

CREATE TABLE Genres (
    idGenre INT NOT NULL ,
    genreType VARCHAR(100),
    genreName VARCHAR(100),
    PRIMARY KEY (idGenre, genreType)
);

CREATE TABLE animeGenre(
    idAnime INT NOT NULL,
    idGenre INT NOT NULL,
    PRIMARY KEY (idAnime, idGenre),
    FOREIGN KEY (idAnime) REFERENCES Animes (idAnime),
    FOREIGN KEY (idGenre) REFERENCES Genres (idGenre)
);

CREATE TABLE mangaGenre(
    idManga INT NOT NULL,
    idGenre INT NOT NULL,
    PRIMARY KEY (idManga, idGenre),
    FOREIGN KEY (idManga) REFERENCES Mangas (idManga),
    FOREIGN KEY (idGenre) REFERENCES Genres (idGenre)
);

