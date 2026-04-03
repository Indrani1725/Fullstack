package edu.task_13;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public Product addProduct(@Valid @RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }
}