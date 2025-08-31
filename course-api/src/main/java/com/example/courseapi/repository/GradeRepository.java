package com.example.courseapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.courseapi.domain.Grade;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    
    List<Grade> findByEnrollmentId(Long enrollmentId);
    
    List<Grade> findByAssessmentType(String assessmentType);
    
    @Query("SELECT g FROM Grade g WHERE g.enrollment.student.id = :studentId")
    List<Grade> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT g FROM Grade g WHERE g.enrollment.course.id = :courseId")
    List<Grade> findByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT AVG(g.percentage) FROM Grade g WHERE g.enrollment.student.id = :studentId")
    Double findAverageGradeByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT AVG(g.percentage) FROM Grade g WHERE g.enrollment.course.id = :courseId")
    Double findAverageGradeByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT g FROM Grade g WHERE g.enrollment.student.id = :studentId AND g.enrollment.course.id = :courseId")
    List<Grade> findByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}
