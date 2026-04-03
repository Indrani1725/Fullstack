package edu.task_8;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class EmployeeService {
    private List<Employee> employeeList = new ArrayList<>();

    public EmployeeService() {
        // Here is where you "type" or add your employee names
        employeeList.add(new Employee(101, "Alice", "IT"));
        employeeList.add(new Employee(102, "Bob", "HR"));
        employeeList.add(new Employee(103, "Charlie", "Finance")); 
    }

    // This method gives the list to the Controller
    public List<Employee> getEmployees() {
        return employeeList;
    }
}