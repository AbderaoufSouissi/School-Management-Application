package com.ars.backend.service;

import com.ars.backend.dto.StudentRequest;
import com.ars.backend.dto.StudentResponse;
import com.ars.backend.enumeration.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentService {

    Page<StudentResponse> getAllStudents(Pageable pageable);
    StudentResponse getStudentById(Long id);
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentRequest request);
    void deleteStudent(Long id);
    Page<StudentResponse> searchStudents(String search, Pageable pageable);
    Page<StudentResponse> getStudentsByLevel(Level level, Pageable pageable);
}
