package edu.Task_10.service;

import edu.Task_10.Entity.Student;
import java.util.List;

public interface StudentService {
    List<Student> getAll();
    Student getById(Long id);
    Student create(Student student);
    Student update(Long id, Student student);
    void delete(Long id);
}