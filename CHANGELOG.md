# Changelog

## [0.1.4] - 2026-05-15
### Alterado
- Reestruturação de pastas do projeto para manter separação clara entre frontend e backend.
- Arquivos do backend movidos para a pasta raiz `backend`.
- Pasta `frontend-angular` renomeada para `frontend`.
- Documentação (`README.md` e `RUNNING.md`) e workflow do GitHub Actions (`gradle.yml`) atualizados para refletir os novos caminhos de diretório.

## [0.1.3] - 2026-04-27
### Alterado
- `build.gradle` atualizado para reduzir deprecations do Gradle 9:
  - substituicao de `sourceCompatibility` por configuracao moderna de `java.toolchain`;
  - adicao de `options.release = 17` para manter compatibilidade de bytecode;
  - declaracao explicita de `testRuntimeOnly 'org.junit.platform:junit-platform-launcher'`.
- `README.md` atualizado com instrucoes completas de execucao (backend, frontend, build e testes).

### Adicionado
- Configuracao de Build Scan no `settings.gradle` com plugin `com.gradle.develocity` e aceite de termos para publicacao automatica do scan.

### Build / Validacao
- Build validado com `gradle clean build --warning-mode all` (sucesso).
- Build Scan publicado: `https://gradle.com/s/ws4ng3jvrqnx6`.

## [0.1.2] - 2026-04-26
### Adicionado
- Novo frontend Angular em `frontend-angular` com interface para:
  - cadastro e edicao de itens;
  - listagem paginada com filtro por categoria;
  - emprestimo e devolucao;
  - exclusao de item com suporte a justificativa quando emprestado.
- Modelos e servico HTTP no front alinhados aos endpoints atuais do backend (`/itens`).
- Instrucoes de execucao do frontend adicionadas no `README.md`.

### Proposta de melhoria
- Adicionar configuracao de proxy no Angular (ex.: `proxy.conf.json` + ajuste no script `start`) para redirecionar `/api` para `http://localhost:8080`, evitando CORS em desenvolvimento e removendo URL fixa no frontend.

## [0.1.1] - 2026-04-23
### Adicionado
- Documentacao da API com Swagger/OpenAPI via `springdoc-openapi-starter-webmvc-ui` no `build.gradle`.
- Nova configuracao global da OpenAPI em `OpenApiConfig` com metadados (titulo, descricao, versao e contato).
- Anotacoes de documentacao no `ItemController` (`@Tag`, `@Operation`, `@ApiResponses`) para descrever endpoints e codigos de retorno.
- Anotacoes `@Schema` em `ItemRequestDTO` e `ItemResponseDTO` para melhorar exemplos e descricoes no Swagger UI.
- Nova regra de negocio para exclusao de item emprestado: o item nao e removido, e marcado como perdido com justificativa obrigatoria.
- Novo DTO `ItemDeleteRequestDTO` para receber justificativa no `DELETE /itens/{id}`.
- Campos `perdido` e `justificativaPerda` adicionados no `Item` e expostos no `ItemResponseDTO`.
- Testes de servico atualizados e ampliados (`ItemServiceTest`) cobrindo exclusao de item emprestado, marcacao de perda, exclusao normal e bloqueio de emprestimo para item perdido.

### Como acessar
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## [0.1.0] - 2026-02-03
### Adicionado
- Scaffold inicial do MVP implementado (commit: "scaffold: implement plan MVP (entity, service, controller, DTOs, tests, front, Docker)")
- Estrutura do projeto:
  - `build.gradle`, `settings.gradle`, `.gitignore`
  - Aplicação Spring Boot: `MycolectionApplication`
  - Model: `Item`, `TipoMidia`
  - Repository: `ItemRepository` (+ método de filtro por categoria)
  - DTOs: `ItemRequestDTO`, `ItemResponseDTO`
  - Mapper: `ItemMapper`
  - Service: `ItemService` (regras de negócio: validação de `console` para `JOGO`, emprestar/devolver)
  - Controller REST: `ItemController` (endpoints CRUD + emprestar/devolver)
  - Exceções e handler: `BusinessException`, `NotFoundException`, `RestExceptionHandler`
  - Front-end simples: `src/main/resources/static/index.html` e `app.js`
  - `Dockerfile` para build/execução da imagem
  - `RUNNING.md` com instruções rápidas de execução
  - Testes unitários de serviço: `ItemServiceTest`
  - `.github/copilot-instructions.md` com instruções para agentes de IA

### Observações
- Mensagens de validação e erros em **português** conforme especificação.
- H2 configurado em memória: `jdbc:h2:mem:acervo` (H2 Console habilitado).

### Questões em aberto / decisões pendentes
- Comportamento ao tentar **deletar um item que está emprestado** (FR-015): bloquear exclusão ou permitir? ✔️ Marcar como decisão pendente.
- Armazenar campo explícito `status` (DISPONIVEL/EMPRESTADO) vs. derivar por datas (FR-016): decidir abordagem antes de expandir regras de negócio.

### Próximos passos recomendados
1. Adicionar testes de integração para `ItemController` (`@WebMvcTest`) e um teste de integração `@SpringBootTest` com H2.
2. Decidir comportamento de exclusão para itens emprestados e documentar a escolha em uma issue (referenciar FR-015).
3. Revisar mensagens de erro e cobrir com testes que assertem o texto (especialmente validação de `console`).
4. Opcional: adicionar `docker-compose.yml` e melhorar cobertura de testes.

---
*Arquivo gerado automaticamente para controle das alterações e comunicação entre desenvolvedores.*