package fr.projet.ISS.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class IndexController {
	
	public IndexController() {
		
	}
	
	@GetMapping("/index")
	public String pageAccueil() {
		return "index";
	}
	@GetMapping("/login")
	public String login() {
		return "index";
	}

}
