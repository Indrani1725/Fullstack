package edu.task_8;

public class Employee {
    private int id;
    private String name;
    private String department;

    public Employee(int id, String name, String department) {
        this.id = id;
        this.name = name;
        this.department = department;
    }

    // These MUST be exactly like this for the browser to see them
    public int getId() { return id; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
}