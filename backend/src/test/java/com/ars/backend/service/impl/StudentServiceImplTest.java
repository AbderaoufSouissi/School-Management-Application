package com.ars.backend.service.impl;

import com.ars.backend.dto.StudentRequest;
import com.ars.backend.dto.StudentResponse;
import com.ars.backend.entity.Student;
import com.ars.backend.enumeration.Level;
import com.ars.backend.exception.DuplicateResourceException;
import com.ars.backend.exception.ResourceNotFoundException;
import com.ars.backend.mapper.StudentMapper;
import com.ars.backend.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("StudentService Tests")
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentMapper studentMapper;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student1;
    private Student student2;
    private StudentRequest studentRequest;
    private StudentResponse studentResponse1;
    private StudentResponse studentResponse2;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        student1 = Student.builder()
                .id(1L)
                .username("student1")
                .level(Level.BACHELOR)
                .build();

        student2 = Student.builder()
                .id(2L)
                .username("student2")
                .level(Level.MASTER)
                .build();

        studentRequest = new StudentRequest(Level.BACHELOR,"newstudent" );

        studentResponse1 = new StudentResponse(1L, "student1", Level.BACHELOR);
        studentResponse2 = new StudentResponse(2L, "student2", Level.MASTER);

        pageable = PageRequest.of(0, 10);
    }

    @Test
    @DisplayName("Should return all students with pagination")
    void getAllStudents_Success() {
        // Given
        List<Student> students = Arrays.asList(student1, student2);
        Page<Student> studentPage = new PageImpl<>(students, pageable, students.size());

        when(studentRepository.findAll(pageable)).thenReturn(studentPage);
        when(studentMapper.toResponse(student1)).thenReturn(studentResponse1);
        when(studentMapper.toResponse(student2)).thenReturn(studentResponse2);

        // When
        Page<StudentResponse> result = studentService.getAllStudents(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(2);
        verify(studentRepository).findAll(pageable);
        verify(studentMapper, times(2)).toResponse(any(Student.class));
    }

    @Test
    @DisplayName("Should return student by ID")
    void getStudentById_Success() {
        // Given
        Long studentId = 1L;
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student1));
        when(studentMapper.toResponse(student1)).thenReturn(studentResponse1);

        // When
        StudentResponse result = studentService.getStudentById(studentId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(studentId);
        assertThat(result.username()).isEqualTo("student1");
        verify(studentRepository).findById(studentId);
        verify(studentMapper).toResponse(student1);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when student ID not found")
    void getStudentById_NotFound_ThrowsException() {
        // Given
        Long studentId = 999L;
        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> studentService.getStudentById(studentId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found with id: " + studentId);

        verify(studentRepository).findById(studentId);
        verify(studentMapper, never()).toResponse(any(Student.class));
    }

    @Test
    @DisplayName("Should successfully create a new student")
    void createStudent_Success() {
        // Given
        when(studentRepository.findByUsername(studentRequest.username())).thenReturn(Optional.empty());
        when(studentMapper.toEntity(studentRequest)).thenReturn(student1);
        when(studentRepository.save(student1)).thenReturn(student1);
        when(studentMapper.toResponse(student1)).thenReturn(studentResponse1);

        // When
        StudentResponse result = studentService.createStudent(studentRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.username()).isEqualTo(studentRequest.username());
        verify(studentRepository).findByUsername(studentRequest.username());
        verify(studentMapper).toEntity(studentRequest);
        verify(studentRepository).save(student1);
        verify(studentMapper).toResponse(student1);
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when creating student with existing username")
    void createStudent_DuplicateUsername_ThrowsException() {
        // Given
        when(studentRepository.findByUsername(studentRequest.username())).thenReturn(Optional.of(student1));

        // When & Then
        assertThatThrownBy(() -> studentService.createStudent(studentRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Student with username '" + studentRequest.username() + "' already exists");

        verify(studentRepository).findByUsername(studentRequest.username());
        verify(studentMapper, never()).toEntity(any(StudentRequest.class));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should successfully update an existing student")
    void updateStudent_Success() {
        // Given
        Long studentId = 1L;
        StudentRequest updateRequest = new StudentRequest( Level.ENGINEER,"updatedusername");
        Student updatedStudent = Student.builder()
                .id(studentId)
                .username("updatedusername")
                .level(Level.ENGINEER)
                .build();
        StudentResponse updatedResponse = new StudentResponse(studentId, "updatedusername", Level.ENGINEER);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student1));
        when(studentRepository.findByUsername(updateRequest.username())).thenReturn(Optional.empty());
        doNothing().when(studentMapper).updateEntity(student1, updateRequest);
        when(studentRepository.save(student1)).thenReturn(updatedStudent);
        when(studentMapper.toResponse(updatedStudent)).thenReturn(updatedResponse);

        // When
        StudentResponse result = studentService.updateStudent(studentId, updateRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.username()).isEqualTo("updatedusername");
        assertThat(result.level()).isEqualTo(Level.ENGINEER);
        verify(studentRepository).findById(studentId);
        verify(studentRepository).findByUsername(updateRequest.username());
        verify(studentMapper).updateEntity(student1, updateRequest);
        verify(studentRepository).save(student1);
        verify(studentMapper).toResponse(updatedStudent);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent student")
    void updateStudent_StudentNotFound_ThrowsException() {
        // Given
        Long studentId = 999L;
        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> studentService.updateStudent(studentId, studentRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found with id: " + studentId);

        verify(studentRepository).findById(studentId);
        verify(studentRepository, never()).findByUsername(anyString());
        verify(studentMapper, never()).updateEntity(any(), any());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when updating to an existing username")
    void updateStudent_DuplicateUsername_ThrowsException() {
        // Given
        Long studentId = 1L;
        StudentRequest updateRequest = new StudentRequest( Level.BACHELOR,"student2");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student1));
        when(studentRepository.findByUsername(updateRequest.username())).thenReturn(Optional.of(student2));

        // When & Then
        assertThatThrownBy(() -> studentService.updateStudent(studentId, updateRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Student with username '" + updateRequest.username() + "' already exists");

        verify(studentRepository).findById(studentId);
        verify(studentRepository).findByUsername(updateRequest.username());
        verify(studentMapper, never()).updateEntity(any(), any());
    }

    @Test
    @DisplayName("Should allow updating student with same username")
    void updateStudent_SameUsername_Success() {
        // Given
        Long studentId = 1L;
        StudentRequest updateRequest = new StudentRequest(Level.MASTER,"student1" );
        Student updatedStudent = Student.builder()
                .id(studentId)
                .username("student1")
                .level(Level.MASTER)
                .build();
        StudentResponse updatedResponse = new StudentResponse(studentId, "student1", Level.MASTER);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student1));
        when(studentRepository.findByUsername(updateRequest.username())).thenReturn(Optional.of(student1));
        doNothing().when(studentMapper).updateEntity(student1, updateRequest);
        when(studentRepository.save(student1)).thenReturn(updatedStudent);
        when(studentMapper.toResponse(updatedStudent)).thenReturn(updatedResponse);

        // When
        StudentResponse result = studentService.updateStudent(studentId, updateRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.username()).isEqualTo("student1");
        assertThat(result.level()).isEqualTo(Level.MASTER);
        verify(studentRepository).findById(studentId);
        verify(studentRepository).findByUsername(updateRequest.username());
        verify(studentMapper).updateEntity(student1, updateRequest);
    }

    @Test
    @DisplayName("Should successfully delete a student")
    void deleteStudent_Success() {
        // Given
        Long studentId = 1L;
        when(studentRepository.existsById(studentId)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(studentId);

        // When
        studentService.deleteStudent(studentId);

        // Then
        verify(studentRepository).existsById(studentId);
        verify(studentRepository).deleteById(studentId);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent student")
    void deleteStudent_StudentNotFound_ThrowsException() {
        // Given
        Long studentId = 999L;
        when(studentRepository.existsById(studentId)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> studentService.deleteStudent(studentId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found with id: " + studentId);

        verify(studentRepository).existsById(studentId);
        verify(studentRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Should search students by username or ID")
    void searchStudents_Success() {
        // Given
        String searchTerm = "student";
        List<Student> students = Arrays.asList(student1, student2);
        Page<Student> studentPage = new PageImpl<>(students, pageable, students.size());

        when(studentRepository.searchByUsernameOrId(searchTerm, pageable)).thenReturn(studentPage);
        when(studentMapper.toResponse(student1)).thenReturn(studentResponse1);
        when(studentMapper.toResponse(student2)).thenReturn(studentResponse2);

        // When
        Page<StudentResponse> result = studentService.searchStudents(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(2);
        verify(studentRepository).searchByUsernameOrId(searchTerm, pageable);
        verify(studentMapper, times(2)).toResponse(any(Student.class));
    }

    @Test
    @DisplayName("Should return empty page when search finds no results")
    void searchStudents_NoResults_ReturnsEmptyPage() {
        // Given
        String searchTerm = "nonexistent";
        Page<Student> emptyPage = new PageImpl<>(List.of(), pageable, 0);

        when(studentRepository.searchByUsernameOrId(searchTerm, pageable)).thenReturn(emptyPage);

        // When
        Page<StudentResponse> result = studentService.searchStudents(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
        verify(studentRepository).searchByUsernameOrId(searchTerm, pageable);
        verify(studentMapper, never()).toResponse(any(Student.class));
    }

    @Test
    @DisplayName("Should filter students by level")
    void getStudentsByLevel_Success() {
        // Given
        Level level = Level.BACHELOR;
        List<Student> students = List.of(student1);
        Page<Student> studentPage = new PageImpl<>(students, pageable, students.size());

        when(studentRepository.findByLevel(level, pageable)).thenReturn(studentPage);
        when(studentMapper.toResponse(student1)).thenReturn(studentResponse1);

        // When
        Page<StudentResponse> result = studentService.getStudentsByLevel(level, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().level()).isEqualTo(Level.BACHELOR);
        verify(studentRepository).findByLevel(level, pageable);
        verify(studentMapper).toResponse(student1);
    }

    @Test
    @DisplayName("Should return empty page when no students found for level")
    void getStudentsByLevel_NoResults_ReturnsEmptyPage() {
        // Given
        Level level = Level.DOCTORATE;
        Page<Student> emptyPage = new PageImpl<>(List.of(), pageable, 0);

        when(studentRepository.findByLevel(level, pageable)).thenReturn(emptyPage);

        // When
        Page<StudentResponse> result = studentService.getStudentsByLevel(level, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
        verify(studentRepository).findByLevel(level, pageable);
        verify(studentMapper, never()).toResponse(any(Student.class));
    }

    @Test
    @DisplayName("Should handle pagination correctly")
    void getAllStudents_Pagination_Success() {
        // Given
        Pageable customPageable = PageRequest.of(1, 5);
        List<Student> students = List.of(student1);
        Page<Student> studentPage = new PageImpl<>(students, customPageable, 10);

        when(studentRepository.findAll(customPageable)).thenReturn(studentPage);
        when(studentMapper.toResponse(student1)).thenReturn(studentResponse1);

        // When
        Page<StudentResponse> result = studentService.getAllStudents(customPageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getNumber()).isEqualTo(1);
        assertThat(result.getSize()).isEqualTo(5);
        assertThat(result.getTotalElements()).isEqualTo(10);
        verify(studentRepository).findAll(customPageable);
    }
}

