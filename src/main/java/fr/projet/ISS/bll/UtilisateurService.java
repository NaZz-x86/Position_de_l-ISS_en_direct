package fr.projet.ISS.bll;

import java.util.List;

import fr.projet.ISS.bo.Utilisateur;
import fr.projet.ISS.exceptions.BusinessException;

public interface UtilisateurService {

	List<Utilisateur> listDesUtilisateurs();
	
	Utilisateur consulterUtilisateurParId(int id);
	
	Utilisateur consulterUtilisateurParEmail(String email);
	
	void creerUtilisateur(Utilisateur utilisateur)throws BusinessException;
	
	void modifUtilisateur(Utilisateur utilisateur)throws BusinessException;
	
	void supprimerUtilisateur(int id);
}

