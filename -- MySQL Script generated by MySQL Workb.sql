-- Table Formations
CREATE TABLE Formations (
    formation_id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255),
    adresse VARCHAR(255),
    ville VARCHAR(255),
    pays VARCHAR(255)
);

-- Table Users
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    email VARCHAR(255),
    matiere VARCHAR(255)
);

-- Table Users_Formations (Table de jointure)
CREATE TABLE Users_Formations (
    user_id INT,
    formation_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (formation_id) REFERENCES Formations(formation_id),
    PRIMARY KEY (user_id, formation_id)
);

-- Table Classes
CREATE TABLE Classes (
    classe_id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255),
    description TEXT,
    formation_id INT,
    FOREIGN KEY (formation_id) REFERENCES Formations(formation_id)
);

-- Table Elèves
CREATE TABLE Eleves (
    eleve_id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    classe_id INT,
    FOREIGN KEY (classe_id) REFERENCES Classes(classe_id)
);
