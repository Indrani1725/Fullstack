package edu.Task_10.Controller;

import edu.Task_10.Entity.*;
import edu.Task_10.service.*;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/students")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // READ (List)
    @GetMapping
    public String listStudents(Model model) {
        model.addAttribute("students", service.getAll());
        return "students/list";
    }

    // CREATE (Form)
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("student", new Student());
        return "students/form";
    }

    // CREATE (Submit)
    @PostMapping
    public String create(@Valid @ModelAttribute("student") Student student,
                         BindingResult result) {
        if (result.hasErrors()) return "students/form";
        service.create(student);
        return "redirect:/students";
    }

    // UPDATE (Form)
    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        model.addAttribute("student", service.getById(id));
        return "students/form";
    }

    // UPDATE (Submit)
    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("student") Student student,
                         BindingResult result) {
        if (result.hasErrors()) return "students/form";
        service.update(id, student);
        return "redirect:/students";
    }

    // DELETE
    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/students";
    }
}