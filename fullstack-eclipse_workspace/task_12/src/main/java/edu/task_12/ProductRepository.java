package edu.task_12;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.task_12.Product; // This tells it exactly where Product is

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}