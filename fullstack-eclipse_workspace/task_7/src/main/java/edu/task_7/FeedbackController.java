package edu.task_7;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*") 
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping("/submit")
    public String saveFeedback(@RequestBody Feedback feedback) {
        feedbackRepository.save(feedback);
        return "Feedback saved successfully!";
    }
}
