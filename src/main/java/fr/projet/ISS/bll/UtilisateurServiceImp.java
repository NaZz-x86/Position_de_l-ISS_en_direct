package fr.projet.ISS.bll;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import fr.projet.ISS.bo.Utilisateur;
import fr.projet.ISS.dal.UtilisateurDAO;
import fr.projet.ISS.exceptions.BusinessException;

public class UtilisateurServiceImp implements UtilisateurService {
	
	private UtilisateurDAO utilisateurDAO;
	
	

	public UtilisateurServiceImp(UtilisateurDAO utilisateurDAO) {
		this.utilisateurDAO = utilisateurDAO;
	}

	@Override
	public List<Utilisateur> listDesUtilisateurs() {
		List<Utilisateur> listUtilisateur = utilisateurDAO.trouveTout();
		return listUtilisateur;
	}

	@Override
	public Utilisateur consulterUtilisateurParId(int id) {
		Utilisateur utilisateur = utilisateurDAO.trouveParId(id);
		return utilisateur;
	}

	@Override
	public Utilisateur consulterUtilisateurParEmail(String email) {
		Utilisateur utilisateur = utilisateurDAO.trouveParEmail(email);
		return utilisateur;
	}

	@Override
	public void creerUtilisateur(Utilisateur utilisateur) throws BusinessException {
		BusinessException be = new BusinessException();
		boolean estValid = verifEmail(utilisateur, be);
		
		if(estValid) {
			try {
				String mot_de_passe = utilisateur.getMot_de_passe();
				BCryptPasswordEncoder MDPencoder = new BCryptPasswordEncoder();
				String hachéeMDP = MDPencoder.encode(mot_de_passe);
				
				utilisateur.setMot_de_passe(hachéeMDP);
				utilisateurDAO.creerUtilisateur(utilisateur);
			}catch(DataAccessException e) {
				be.add("Email n'est pas valide");
			}
		}else {
			throw be;
		}
		
	}

	private boolean verifEmail(Utilisateur utilisateur, BusinessException be) {
		boolean estValid = false;
		if(!utilisateurDAO.trouveTout().stream().anyMatch(utilisateurExistant -> utilisateurExistant.getEmail().equals(utilisateur.getEmail()))) {
			estValid = true;
		}else {
			be.add("L'email existe déjà dans la base de données");
		}
		return estValid;
	}

	@Override
	public void modifUtilisateur(Utilisateur utilisateur) throws BusinessException {
		BusinessException be = new BusinessException();
		
		try {
			utilisateurDAO.miseAjourUtilisateur(utilisateur);
		}catch (DataAccessException e) {
			be.add("Un problème est survenu lors de la connextion à la base de données");
			throw be;
		}
		
	}

	@Override
	public void supprimerUtilisateur(int id) {
		utilisateurDAO.supprimerUtilisateur(id);
		
	}

}
