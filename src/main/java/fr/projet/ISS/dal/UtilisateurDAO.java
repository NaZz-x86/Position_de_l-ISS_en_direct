package fr.projet.ISS.dal;

import java.util.List;

import fr.projet.ISS.bo.Utilisateur;

public interface UtilisateurDAO {
	
	List<Utilisateur> trouveTout();
	
	Utilisateur trouveParId(int id);
	
	Utilisateur trouveParEmail(String email);
	
	void creerUtilisateur(Utilisateur utilisateur);
	
	void miseAjourUtilisateur(Utilisateur utilisateur);
	
	void supprimerUtilisateur (int id);
}
