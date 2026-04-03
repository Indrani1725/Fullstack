package edu.Factorial_01;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller

public class FactController {
	@Autowired
	private FactService service;
	
	
	@GetMapping("/")
	public String showForm()
	{
		return "fact";
	}
	
	@PostMapping("/calculate")
	public String calculate(@RequestParam int no,Model model)
	{
		long result = service.calculateFact(no);
		model.addAttribute("number",no);
		model.addAttribute("result",result);
		
		return "fact";
	}
	
		
}
