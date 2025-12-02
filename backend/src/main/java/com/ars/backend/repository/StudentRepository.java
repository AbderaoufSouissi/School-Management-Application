package com.ars.backend.repository;

import com.ars.backend.entity.Student;
import com.ars.backend.enumeration.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUsername(String username);

    Page<Student> findByLevel(Level level, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE LOWER(s.username) LIKE LOWER(CONCAT('%', :search, '%')) OR CAST(s.id AS string) LIKE CONCAT('%', :search, '%')")
    Page<Student> searchByUsernameOrId(@Param("search") String search, Pageable pageable);
}
