package com.ars.backend.service.impl;

import com.ars.backend.dto.StudentRequest;
import com.ars.backend.dto.StudentResponse;
import com.ars.backend.entity.Student;
import com.ars.backend.enumeration.Level;
import com.ars.backend.exception.DuplicateResourceException;
import com.ars.backend.exception.ResourceNotFoundException;
import com.ars.backend.mapper.StudentMapper;
import com.ars.backend.repository.StudentRepository;
import com.ars.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable)
                .map(studentMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return studentMapper.toResponse(student);
    }

    @Override
    public StudentResponse createStudent(StudentRequest request) {
        // Check for duplicate username
        studentRepository.findByUsername(request.username())
                .ifPresent(s -> {
                    throw new DuplicateResourceException("Student with username '" + request.username() + "' already exists");
                });

        Student student = studentMapper.toEntity(request);
        Student savedStudent = studentRepository.save(student);
        return studentMapper.toResponse(savedStudent);
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check if new username conflicts with another student
        studentRepository.findByUsername(request.username())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new DuplicateResourceException("Student with username '" + request.username() + "' already exists");
                    }
                });

        studentMapper.updateEntity(student, request);
        Student updatedStudent = studentRepository.save(student);
        return studentMapper.toResponse(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> searchStudents(String search, Pageable pageable) {
        return studentRepository.searchByUsernameOrId(search, pageable)
                .map(studentMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudentsByLevel(Level level, Pageable pageable) {
        return studentRepository.findByLevel(level, pageable)
                .map(studentMapper::toResponse);
    }
}
