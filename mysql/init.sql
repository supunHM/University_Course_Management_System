# Dockerfile for Spring Boot Backend
FROM openjdk:17-jdk-slim as build
VOLUME /tmp
COPY target/course-api-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]