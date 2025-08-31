package com.example.courseapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.courseapi.domain.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudentId(Long studentId);
    
    List<Enrollment> findByCourseId(Long courseId);
    
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    List<Enrollment> findByStatus(Enrollment.EnrollmentStatus status);
    
    List<Enrollment> findBySemester(String semester);
    
    List<Enrollment> findByAcademicYear(String academicYear);
    
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId")
    Long countByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student.department = :department")
    List<Enrollment> findByStudentDepartment(@Param("department") String department);
}
