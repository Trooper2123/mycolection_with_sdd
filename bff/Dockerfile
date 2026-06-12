# Build stage
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY bff .
RUN gradle clean build -x test

# Runtime stage
FROM openjdk:21-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# Expor porta
EXPOSE 8081

# Variáveis de ambiente
ENV SERVER_PORT=8081
ENV CORE_API_BASE_URL=http://backend:8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher | grep -q "Started BffApplication" || exit 1

# Rodar aplicação
ENTRYPOINT ["java", "-Dserver.port=8081", "-jar", "app.jar"]

