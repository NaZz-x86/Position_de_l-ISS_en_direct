package fr.projet.ISS.dal;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import fr.projet.ISS.bo.Utilisateur;

public class UtilisateurDAOImpl implements UtilisateurDAO {
	
	private static final String TROUVE_TOUT = "SELECT id, nom, prenom, email, mot_de_passe, administrateur FROM UTILISATEURS";
	private static final String TROUVE_AVEC_ID = "SELECT id, nom, prenom, email, mot_de_passe, administrateur FROM UTILISATEURS WHERE id = :id";
	private static final String TROUVE_PAR_EMAIL ="SELECT id, nom, prenom, email, mot_de_passe, administrateur FROM UTILISATEURS WHERE email = :email";
	private static final String CREER_UTILISATEUR ="INSERT INTO UTILISATEURS(nom, prenom, email, mot_de_passe, administrateur)\r\n"
			+ "VALUES(:nom,:prenom,:email,:mode_de_passe,:administrateur);";
	private static final String UPDATE_UTILISATEUR = "UPDATE UTILISATEURS SET nom = :nom, prenom = :prenom, email = :email WHERE id = id";
	private static final String SUPPRIMER_UTILISATEUR = "DELETE FROM UTILISATEURS WHERE id=:id";
	
	private NamedParameterJdbcTemplate jdbcTemplate;
	
	
	
	public UtilisateurDAOImpl(NamedParameterJdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<Utilisateur> trouveTout() {
		return jdbcTemplate.query(TROUVE_TOUT, new UtilisateurRowMapper());
	}

	@Override
	public Utilisateur trouveParId(int id) {
		MapSqlParameterSource parameterSource = new MapSqlParameterSource();
		parameterSource.addValue("id", id);
		return jdbcTemplate.queryForObject(TROUVE_AVEC_ID, parameterSource, new UtilisateurRowMapper());
	}

	@Override
	public Utilisateur trouveParEmail(String email) {
		MapSqlParameterSource parameterSource = new MapSqlParameterSource();
		parameterSource.addValue("email", email);
		return jdbcTemplate.queryForObject(TROUVE_PAR_EMAIL, parameterSource, new UtilisateurRowMapper());
	}

	@Override
	public void creerUtilisateur(Utilisateur utilisateur) {
		MapSqlParameterSource parameterSource = new MapSqlParameterSource();
		
		parameterSource.addValue("nom", utilisateur.getNom());
		parameterSource.addValue("prenom", utilisateur.getPrenom());
		parameterSource.addValue("email", utilisateur.getEmail());
		parameterSource.addValue("mot_de_passe", utilisateur.getMot_de_passe());
		parameterSource.addValue("administrateur", utilisateur.isAdministrateur());
		
		jdbcTemplate.update(CREER_UTILISATEUR, parameterSource);
		
	}

	@Override
	public void miseAjourUtilisateur(Utilisateur utilisateur) {
		MapSqlParameterSource parameterSource = new MapSqlParameterSource();
		
		parameterSource.addValue("nom", utilisateur.getNom());
		parameterSource.addValue("prenom", utilisateur.getPrenom());
		parameterSource.addValue("email", utilisateur.getEmail());
		parameterSource.addValue("mot_de_passe", utilisateur.getMot_de_passe());
		parameterSource.addValue("administrateur", utilisateur.isAdministrateur());
		
		jdbcTemplate.update(UPDATE_UTILISATEUR, parameterSource);
		
	}

	@Override
	public void supprimerUtilisateur(int id) {
		MapSqlParameterSource parameterSource = new MapSqlParameterSource();
		parameterSource.addValue("id", id);
		jdbcTemplate.update(SUPPRIMER_UTILISATEUR, parameterSource);
		
	}
	
	class UtilisateurRowMapper implements RowMapper<Utilisateur>{
		@Override
		public Utilisateur mapRow(ResultSet rs, int rowNum) throws SQLException {
			Utilisateur utilisateur = new Utilisateur();
			utilisateur.setId(rs.getInt("id"));
			utilisateur.setNom(rs.getString("nom"));
			utilisateur.setPrenom(rs.getString("prenom"));
			utilisateur.setEmail(rs.getString("email"));
			utilisateur.setMot_de_passe(rs.getString("mot_de_passe"));
			utilisateur.setAdministrateur(rs.getBoolean("administrateur"));
			return utilisateur;
		}
	}
	
}
