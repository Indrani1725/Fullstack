package edu.Task_10.service;

import edu.Task_10.Entity.*;
import edu.Task_10.repository.*;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository repo;

    public StudentServiceImpl(StudentRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Student> getAll() {
        return repo.findAll();
    }

    @Override
    public Student getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }

    @Override
    public Student create(Student student) {
        repo.findByEmail(student.getEmail()).ifPresent(s -> {
            throw new RuntimeException("Email already exists: " + student.getEmail());
        });
        return repo.save(student);
    }

    @Override
    public Student update(Long id, Student student) {
        Student existing = getById(id);
        existing.setName(student.getName());
        existing.setEmail(student.getEmail());
        existing.setDepartment(student.getDepartment());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Student not found: " + id);
        }
        repo.deleteById(id);
    }
}