--Trouve Tout
SELECT id, nom, prenom, email, mot_de_passe, administrateur FROM UTILISATEURS;
--Trouve avec id 
SELECT id, nom, prenom, email, mot_de_passe, administrateur FROM UTILISATEURS WHERE id = 1;
--Trouve avec email
SELECT id, nom, prenom, email, mot_de_passe, administrateur FROM UTILISATEURS WHERE email = 'nicolas.laurent8662@gmail.com';
--Insert utilisateur
INSERT INTO UTILISATEURS(nom, prenom, email, mot_de_passe, administrateur)
VALUES('Nicolas','Laurent','nicolas.laurent8662@gmail.com','$2y$10$26nOTtFPx2BTBVaxZChPou6/Uz4fx5MOtFwEyttj/rWQm.lwADRYu','true');
--Modification utilisateur
UPDATE UTILISATEURS SET nom = 'Laurent', prenom = 'Nicolas', email = :email WHERE id = 1;
--Suprimer compte 
DELETE FROM UTILISATEURS WHERE id = :id;