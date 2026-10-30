package com.anjali.studentapi;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class StudentController {


private final StudentRepository repository;

public StudentController(StudentRepository repository) {
    this.repository = repository;
}

@PostMapping
public ResponseEntity<Student> createStudent(
        @Valid @RequestBody Student student) {
    student.setId(null);
    Student savedStudent = repository.save(student);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
}

@GetMapping
public ResponseEntity<List<Student>> getAllStudents() {
    return ResponseEntity.ok(repository.findAll());
}

@GetMapping("/{id}")
public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
    return repository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
}

@PutMapping("/{id}")
public ResponseEntity<Student> updateStudent(
        @PathVariable Long id,
        @Valid @RequestBody Student studentDetails) {
    return repository.findById(id).map(existingStudent -> {
        existingStudent.setName(studentDetails.getName());
        existingStudent.setEmail(studentDetails.getEmail());
        existingStudent.setCourse(studentDetails.getCourse());
        Student updatedStudent = repository.save(existingStudent);
        return ResponseEntity.ok(updatedStudent);
    }).orElseGet(() -> ResponseEntity.notFound().build());
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
    if (!repository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }
    repository.deleteById(id);
    return ResponseEntity.noContent().build();
}


}
