package fr.projet.ISS.bo;

import java.io.Serializable;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class Utilisateur implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int id;
	@NotNull
	@Pattern(regexp = "^[a-zA-ZÀ-ÖØ-öø-ÿ -]*$", message="Le nom ne doit contenir que des lettre")
	private String nom;
	@NotNull
	@Pattern(regexp = "^[a-zA-ZÀ-ÖØ-öø-ÿ -]*$", message="Le prenom de doit contenir que des lettre")
	private String prenom;
	@NotNull
	@Pattern(regexp="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$", message="Email non valide")
	private String email;
	@NotNull
	@Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{8,}$", message="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial")
	private String mot_de_passe;
	private boolean administrateur;
	
	
	public Utilisateur() {
	}
	
	public Utilisateur(int id, String nom, String prenom, String email, String mot_de_passe, boolean administrateur) {
		this.id = id;
		this.nom = nom;
		this.prenom = prenom;
		this.email = email;
		this.mot_de_passe = mot_de_passe;
		this.administrateur = administrateur;
	}

	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMot_de_passe() {
		return mot_de_passe;
	}

	public void setMot_de_passe(String mot_de_passe) {
		this.mot_de_passe = mot_de_passe;
	}

	public boolean isAdministrateur() {
		return administrateur;
	}

	public void setAdministrateur(boolean administrateur) {
		this.administrateur = administrateur;
	}

	@Override
	public String toString() {
		return String.format("Utilisateur [id=%s, nom=%s, prenom=%s, administrateur=%s]", id, nom, prenom,
				administrateur);
	}
}
