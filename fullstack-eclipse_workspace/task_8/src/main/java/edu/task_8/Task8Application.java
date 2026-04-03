package edu.task_8;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class Task8Application {

    public static void main(String[] args) {
        // 1. Start the Spring Container (this acts as your BeanFactory)
        ApplicationContext context = SpringApplication.run(Task8Application.class, args);

        // 2. Get the EmployeeController bean from the container
        // This proves Inversion of Control (IoC)
        EmployeeController controller = context.getBean(EmployeeController.class);

        // 3. Display the data
        controller.displayData();
    }
}