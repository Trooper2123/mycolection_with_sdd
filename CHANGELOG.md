# Changelog

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