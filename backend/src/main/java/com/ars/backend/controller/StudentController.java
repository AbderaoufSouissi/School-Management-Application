package com.ars.backend.controller;

import com.ars.backend.dto.StudentRequest;
import com.ars.backend.dto.StudentResponse;
import com.ars.backend.enumeration.Level;
import com.ars.backend.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    /**
     * Get all students with pagination
     * GET /api/students?page=0&size=10&sort=id,desc
     */
    @GetMapping
    public ResponseEntity<Page<StudentResponse>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<StudentResponse> students = studentService.getAllStudents(pageable);
        return ResponseEntity.ok(students);
    }

    /**
     * Get student by ID
     * GET /api/students/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    /**
     * Create a new student
     * POST /api/students
     */
    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        StudentResponse student = studentService.createStudent(request);
        return new ResponseEntity<>(student, HttpStatus.CREATED);
    }

    /**
     * Update an existing student
     * PUT /api/students/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        StudentResponse student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(student);
    }

    /**
     * Delete a student
     * DELETE /api/students/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Search students by username or ID
     * GET /api/students/search?query=john&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<StudentResponse>> searchStudents(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<StudentResponse> students = studentService.searchStudents(query, pageable);
        return ResponseEntity.ok(students);
    }

    /**
     * Filter students by level
     * GET /api/students/level/BACHELOR?page=0&size=10
     */
    @GetMapping("/level/{level}")
    public ResponseEntity<Page<StudentResponse>> getStudentsByLevel(
            @PathVariable Level level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<StudentResponse> students = studentService.getStudentsByLevel(level, pageable);
        return ResponseEntity.ok(students);
    }
}

