package com.example.courseapi.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.courseapi.domain.Course;
import com.example.courseapi.domain.Enrollment;
import com.example.courseapi.domain.Grade;
import com.example.courseapi.domain.Student;
import com.example.courseapi.domain.User;
import com.example.courseapi.repository.CourseRepository;
import com.example.courseapi.repository.EnrollmentRepository;
import com.example.courseapi.repository.GradeRepository;
import com.example.courseapi.repository.StudentRepository;
import com.example.courseapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
    public ApplicationRunner seedData() {
        return args -> {
            seedUsersAndStudents();
            seedCourses();
            seedEnrollmentsAndGrades();
            log.info("Data seeding completed.");
        };
    }

    private void seedUsersAndStudents() {
        if (userRepository.count() > 0 || studentRepository.count() > 0) {
            log.info("Users/Students already present, skipping user/student seeding.");
            return;
        }

        log.info("Seeding users & students...");

        // Admin user
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("Admin@123"))
                .email("admin@example.com")
                .firstName("System")
                .lastName("Admin")
                .role(User.Role.ADMIN)
                .build();
        userRepository.save(admin);

        // Students (create Student + linked User using studentId field)
        for (int i = 1; i <= 3; i++) {
            String sid = "S000" + i;
            Student student = Student.builder()
                    .studentId(sid)
                    .firstName("Student" + i)
                    .lastName("Example")
                    .email("student" + i + "@example.com")
                    .phoneNumber("071000000" + i)
                    .dateOfBirth(LocalDate.of(2000, i, Math.min(15, 10 + i)))
                    .address("123 Street Lane")
                    .department(i % 2 == 0 ? "IT" : "CS")
                    .yearOfStudy(1 + (i % 3))
                    .enrollmentDate(LocalDate.now())
                    .build();
            studentRepository.save(student);

            User studentUser = User.builder()
                    .username("student" + i)
                    .password(passwordEncoder.encode("Password@" + i))
                    .email("student" + i + "@example.com")
                    .firstName("Student" + i)
                    .lastName("Example")
                    .role(User.Role.STUDENT)
                    .studentId(sid)
                    .build();
            userRepository.save(studentUser);
        }
    }

    private void seedCourses() {
        if (courseRepository.count() > 0) {
            log.info("Courses already present, skipping course seeding.");
            return;
        }
        log.info("Seeding courses...");
        List<Course> courses = List.of(
                Course.builder().code("CS101").title("Introduction to Programming").description("Basics of programming in Java").credits(3).build(),
                Course.builder().code("CS102").title("Data Structures").description("Arrays, Lists, Trees, Graphs").credits(4).build(),
                Course.builder().code("CS103").title("Databases").description("Relational database design & SQL").credits(3).build()
        );
        courseRepository.saveAll(courses);
    }

    private void seedEnrollmentsAndGrades() {
        if (enrollmentRepository.count() > 0) {
            log.info("Enrollments already present, skipping enrollment/grade seeding.");
            return;
        }
        log.info("Seeding enrollments & grades...");

        List<Student> students = studentRepository.findAll();
        List<Course> courses = courseRepository.findAll();
        if (students.isEmpty() || courses.isEmpty()) {
            log.warn("Cannot seed enrollments: missing students or courses.");
            return;
        }

        for (Student s : students) {
            int idx = 0;
            for (Course c : courses) {
                // Enroll each student into first two courses for brevity
                if (idx++ > 1) break;
                Enrollment enrollment = Enrollment.builder()
                        .student(s)
                        .course(c)
                        .enrollmentDate(LocalDateTime.now())
                        .status(Enrollment.EnrollmentStatus.ENROLLED)
                        .semester("Semester 1")
                        .academicYear("2024/2025")
                        .build();
                enrollmentRepository.save(enrollment);

                // Add a couple of grade records for first course only
                if (c.getCode().equals("CS101")) {
                    Grade quiz = Grade.builder()
                            .enrollment(enrollment)
                            .assessmentType("QUIZ")
                            .assessmentName("Quiz 1")
                            .pointsEarned(18.0)
                            .totalPoints(20.0)
                            .percentage(90.0)
                            .letterGrade("A")
                            .weight(0.1)
                            .assessmentDate(LocalDateTime.now().minusDays(7))
                            .gradedDate(LocalDateTime.now().minusDays(6))
                            .feedback("Great job!")
                            .gradedBy("Admin")
                            .build();
                    gradeRepository.save(quiz);

                    Grade assignment = Grade.builder()
                            .enrollment(enrollment)
                            .assessmentType("ASSIGNMENT")
                            .assessmentName("Assignment 1")
                            .pointsEarned(45.0)
                            .totalPoints(50.0)
                            .percentage(90.0)
                            .letterGrade("A")
                            .weight(0.2)
                            .assessmentDate(LocalDateTime.now().minusDays(4))
                            .gradedDate(LocalDateTime.now().minusDays(3))
                            .feedback("Well structured submission")
                            .gradedBy("Admin")
                            .build();
                    gradeRepository.save(assignment);
                }
            }
        }
    }
}
