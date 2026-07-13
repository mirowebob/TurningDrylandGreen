# --- Stage 1: Build the JAR ---
# Render requires the linux/amd64 platform
FROM --platform=linux/amd64 maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the package, skipping tests to speed up the Render build
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
FROM --platform=linux/amd64 eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the default port (Render will override this, but it is good practice)
EXPOSE 8082

# Run the app and map Spring's port to Render's dynamic PORT environment variable
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8082} -jar app.jar"]