# GitHub Copilot instructions for mycolection_with_sdd

Purpose: give AI coding agents the minimal, actionable context to be productive in this repository.

## Quick context 🚀
- This repository currently contains the project specification (see `specs/` and `README.md`). Implementation expectations: **Java + Spring (Spring Boot)**, **Gradle** build, **H2** local DB, and **Docker** execution.
- Primary goal: implement a small catalog app (itens do acervo) with REST API + simple front-end (no auth). See `specs/criterios_iniciais` and `specs/spec_03022026` for detailed requirements.

## Big-picture architecture 🔧
- Layered app: `controller` (REST) → `service` (business rules) → `repository` (Spring Data JPA) → `model/entity` (JPA) + `dto` (API contracts).
- Persist with JPA/Hibernate into H2 (in-memory or file). Prefer DTOs for API I/O, validate inputs with standard annotations (`@Valid`, `@NotNull`, etc.).
- Front-end: static HTML/JS or Thymeleaf under `src/main/resources/static`/`templates`; must call backend endpoints.

## Key domain facts (must be enforced) ✅
- Main entity: Item
  - Fields: `id`, `nome`, `tipoMidia` (LIVRO, QUADRINHO, MANGA, JOGO), `categorias`, `descricao`, `tags`, `console`, `dataRetirada`, `dataDevolucao`
- Important business rule: when `tipoMidia == JOGO`, `console` is **mandatory** on create & update. All other types: `console` optional/ignored.
- Loan rule: `emprestar` sets `dataRetirada = LocalDate.now()` and `dataDevolucao = dataRetirada.plusMonths(1)`; `devolver` clears these fields. Prevent double-loan on already loaned items.

## API shape / examples (implement these endpoints) 🧭
- GET /itens?categoria=<>&page=<>&size=<> → paginated list, optional category filter (query param `categoria`).
- POST /itens → create item (JSON body); validate required fields (`nome`, `tipoMidia`, `categorias`, `console` if JOGO).
- PUT /itens/{id} → update item; revalidate `console` if type==JOGO.
- DELETE /itens/{id} → hard delete (spec allows hard delete for initial scope).
- POST /itens/{id}/emprestar → set loan dates (deny if already loaned).
- POST /itens/{id}/devolver → clear loan dates.

Use clear, Portuguese validation messages (specs/examples are in Portuguese).

## Tests & development workflows ✅
- Tests must exist for core rules: create/update (console validation for JOGO), list with category filter + pagination, emprestar/devolver logic. Prefer service unit tests and controller integration tests.
- Expected commands:
  - Build & test: `./gradlew build` and `./gradlew test` (tests should run headless).
  - Docker: build `docker build -t mycolection .` and run `docker run -p 8080:8080 mycolection` (or `docker-compose up` if provided).

## Project-specific conventions / hints 💡
- Keep validations in DTO/controller + business rules in `service` layer (console for JOGO enforced in service and controller validation).
- Use `LocalDate` for dates and derive availability from `dataRetirada`/`dataDevolucao` unless maintainers decide to add an explicit `status` field (see open questions).
- Provide user-facing messages in Portuguese; tests should assert message content when validating error cases (e.g., "console é obrigatório para itens do tipo JOGO").

## Known open questions (create issues / call out in PRs) ⚠️
1. Behavior when deleting an item that is currently on loan: **block deletion** vs **allow hard delete** (spec marked NEEDS CLARIFICATION, FR-015).
2. Persist explicit `status` (DISPONIVEL/EMPRESTADO) vs derive from dates (FR-016).
3. Fila de espera (waiting queue) is FUTURE scope — do not implement in initial PRs unless explicitly requested.

## PR and code guidelines 📝
- Make small, focused PRs with at least one test per rule implemented.
- When behavior is ambiguous, implement the simplest option that satisfies acceptance tests and add a clear TODO and an issue linking the decision.
- Update `specs/` if any behavior is chosen that changes the original specification.

## Files to consult immediately 📚
- `specs/criterios_iniciais`
- `specs/spec_03022026`
- `README.md`

---
If anything here is unclear or you want me to adapt the instructions to a preferred coding style (package names, exception handling approach, or test framework specifics), tell me which aspect and I will refine this file.