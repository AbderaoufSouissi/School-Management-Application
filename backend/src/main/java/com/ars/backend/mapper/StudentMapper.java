package com.ars.backend.mapper;

import com.ars.backend.dto.StudentRequest;
import com.ars.backend.dto.StudentResponse;
import com.ars.backend.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public Student toEntity(StudentRequest request) {
        return Student.builder()
                .username(request.username())
                .level(request.level())
                .build();
    }

    public StudentResponse toResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getUsername(),
                student.getLevel()
        );

    }

    public void updateEntity(Student student, StudentRequest request) {
        student.setUsername(request.username());
        student.setLevel(request.level());
    }
}
