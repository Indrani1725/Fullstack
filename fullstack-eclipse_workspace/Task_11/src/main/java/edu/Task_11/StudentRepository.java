package edu.Task_11;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Custom query to find students by their department
    List<Student> findByDepartment(String department);

    // Custom query to find students older than a certain age
    List<Student> findByAgeGreaterThan(int age);
}