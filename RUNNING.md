# Como rodar (Resumo)

- Com Gradle (requer Java + Gradle wrapper):

  - Build e testes: `cd backend && ./gradlew build` (ou `./gradlew test` para só rodar testes)
  - Rodar local: `cd backend && ./gradlew bootRun`

- Com Docker:

  - Build da imagem: `cd backend && docker build -t mycolection .`
  - Run: `docker run -p 8080:8080 mycolection`

- Acesso H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:acervo`, user `sa`)

- Front: estático em `src/main/resources/static/index.html` (acessível em `/`)

