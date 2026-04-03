package edu.task_8;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService; // This is Dependency Injection

    @GetMapping("/employees")
    public List<Employee> displayData() {
        // This pulls the names directly from the Service
        return employeeService.getEmployees();
    }
}