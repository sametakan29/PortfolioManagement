# build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY finance-portal-api/pom.xml ./pom.xml
COPY finance-portal-api/src ./src
RUN mvn clean package -DskipTests

# runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/finance-portal-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
