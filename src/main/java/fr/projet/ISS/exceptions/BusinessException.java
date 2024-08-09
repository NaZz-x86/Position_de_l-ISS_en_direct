package fr.projet.ISS.exceptions;

import java.util.ArrayList;
import java.util.List;

public class BusinessException extends Exception {
	

	private static final long serialVersionUID = 1L;
	private List<String> erreurs;

	public BusinessException() {
		erreurs = new ArrayList<String>();
	}
	public void add(String message) {
		erreurs.add(message);
	}
	public boolean hasError() {
		return !erreurs.isEmpty();
	}
	public List<String> getErreurs(){
		return erreurs;
	}
	

}
