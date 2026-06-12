# ✓ Checklist de Validação - MyCollection BFF

Use este checklist para validar se sua configuração está correta antes de fazer deploy.

---

## ✅ Ambiente Local

### Pré-requisitos Instalados
- [ ] Java 21+ instalado (`java -version`)
- [ ] Gradle 8+ instalado (`gradle -v`)
- [ ] Node.js 22+ e npm instalados (`node -v` e `npm -v`)
- [ ] Git configurado (`git config --list`)
- [ ] Docker instalado (opcional, `docker --version`)

### Repositório Clonado
- [ ] Repositório clonado em `minha_biblioteca/mycolection_with_sdd`
- [ ] Arquivos README.md, ARCHITECTURE.md, DEPLOY.md presentes
- [ ] Pasta `backend/`, `bff/`, `frontend/` existem
- [ ] Arquivo `docker-compose.yml` presente

---

## ✅ Build e Execução

### Backend (Porta 8080)
- [ ] `cd backend && ..\gradlew.bat clean build` executa sem erros
- [ ] `cd backend && ..\gradlew.bat bootRun` inicia com sucesso
- [ ] Terminal mostra "Started MycolectionApplication in X seconds"
- [ ] Acesso a http://localhost:8080 retorna resposta (não 404)
- [ ] Swagger UI acessível: http://localhost:8080/swagger-ui/index.html

### BFF (Porta 8081)
- [ ] `cd bff && ..\gradlew.bat clean build` executa sem erros
- [ ] `cd bff && ..\gradlew.bat bootRun` inicia com sucesso
- [ ] Terminal mostra "Started BffApplication in X seconds"
- [ ] Acesso a http://localhost:8081 retorna resposta (não 404)
- [ ] Swagger UI acessível: http://localhost:8081/swagger-ui/index.html
- [ ] BFF consegue se conectar ao Backend (logs não mostram erro de conexão)

### Frontend (Porta 4200)
- [ ] `npm install` na pasta `frontend/` completa sem erros
- [ ] `npm start` inicia com sucesso
- [ ] Terminal mostra "Angular Live Development Server is listening on localhost:4200"
- [ ] Navegador abre automaticamente http://localhost:4200
- [ ] Página carrega sem erros brancos/404

---

## ✅ Funcionalidades

### API Backend (teste com cURL ou Insomnia)
- [ ] `GET http://localhost:8080/itens` retorna lista vazia (ou itens)
- [ ] `POST http://localhost:8080/itens` cria um item novo
- [ ] `PUT http://localhost:8080/itens/{id}` atualiza um item
- [ ] `DELETE http://localhost:8080/itens/{id}` deleta um item
- [ ] `POST http://localhost:8080/itens/{id}/emprestar` funciona
- [ ] `POST http://localhost:8080/itens/{id}/devolver` funciona

### API BFF (teste com cURL ou Insomnia)
- [ ] `GET http://localhost:8081/bff/itens` retorna lista vazia (ou itens)
- [ ] `POST http://localhost:8081/bff/itens` cria um item novo
- [ ] `PUT http://localhost:8081/bff/itens/{id}` atualiza um item
- [ ] `DELETE http://localhost:8081/bff/itens/{id}` deleta um item
- [ ] `POST http://localhost:8081/bff/itens/{id}/emprestar` funciona
- [ ] `POST http://localhost:8081/bff/itens/{id}/devolver` funciona
- [ ] Respostas incluem campos derivados (statusEmprestimo, labelTipoMidia)

### Interface Frontend (teste manual)
- [ ] Página carrega sem erros no console
- [ ] Clique em "Novo Item" abre modal
- [ ] Preenche formulário e clica "Salvar"
- [ ] Item aparece na lista
- [ ] Filtro por categoria funciona
- [ ] Pagination funciona (vai para próxima página)
- [ ] Clique em "Emprestar" funciona
- [ ] Clique em "Devolver" funciona
- [ ] Clique em "Deletar" abre confirmação
- [ ] Deletar item remove da lista

---

## ✅ Integração

### CORS e Comunicação
- [ ] DevTools Network: Requisições para `/bff/itens` não retornam CORS error
- [ ] Backend e BFF se comunicam (não há logs de connection refused)
- [ ] Frontend e BFF se comunicam (não há logs de CORS blocked)

### Dados End-to-End
- [ ] Criar item no frontend → aparece no BFF → aparece no Backend
- [ ] Listar itens no frontend → dados vêm do BFF → BFF pega do Backend
- [ ] Deletar item no frontend → desaparece do BFF → desaparece do Backend

---

## ✅ Docker

### Docker Compose
- [ ] `docker-compose up` executa sem erros
- [ ] 2-3 containers iniciam (backend, bff, eventualmente frontend)
- [ ] Logs mostram "Started MycolectionApplication" e "Started BffApplication"
- [ ] Portas 8080 e 8081 estão acessíveis
- [ ] `docker-compose down` para corretamente

---

## ✅ Testes

### Testes Backend
- [ ] `cd backend && ..\gradlew.bat test` executa sem failures
- [ ] Output mostra "X tests completed, Y succeeded"
- [ ] Coverage report gerado em `backend/build/reports/jacoco/test/`

### Testes BFF
- [ ] `cd bff && ..\gradlew.bat test` executa sem failures
- [ ] Output mostra "X tests completed, Y succeeded"

### Testes Frontend
- [ ] `cd frontend && npm test` executa sem failures
- [ ] Coverage report gerado (se configurado)

---

## ✅ Documentação

### Arquivos de Documentação
- [ ] README.md presente e atualizado
- [ ] ARCHITECTURE.md explica BFF claramente
- [ ] DEPLOY.md com instruções passo-a-passo
- [ ] QUICK_START.md funciona como esperado
- [ ] INDEX.md lista todos os documentos
- [ ] FRONTEND_CONFIG.md descreve configuração do frontend

### Links em Documentação
- [ ] Links internos funcionam (não retornam 404)
- [ ] Exemplos de código podem ser copiados
- [ ] Instruções são claras e testadas

---

## ✅ Configuração de Ambiente

### Arquivos de Configuração
- [ ] `application.properties` no backend configurado
- [ ] `application.properties` no BFF aponta para backend correto
- [ ] `.env.example` presente e completo
- [ ] `package.json` na raiz com scripts corretos
- [ ] `vercel.json` presente na raiz
- [ ] `docker-compose.yml` presente na raiz

### Variáveis de Ambiente
- [ ] `CORE_API_BASE_URL` configurada corretamente no BFF
- [ ] Frontend consegue ler variáveis de ambiente se necessário
- [ ] `.env` foi criado a partir de `.env.example`

---

## ✅ Git e Versionamento

### Repositório Git
- [ ] `.gitignore` existe e ignora `node_modules`, `build/`, `.gradle/`, etc
- [ ] `git status` mostra arquivos rastreados
- [ ] Commit inicial feito com mensagem descritiva
- [ ] Branches criadas para features (se aplicável)

---

## ✅ Preparação para Deploy

### Antes de Fazer Deploy
- [ ] Todos os testes passam localmente
- [ ] Build executa sem warnings críticos
- [ ] Documentação foi revisada
- [ ] Código foi revisado (code review)
- [ ] Não há vulnerabilidades críticas (se checado com tools)
- [ ] Performance foi validada em `/bff/itens` (< 200ms)

### Credenciais e Segurança
- [ ] Nenhuma senha ou token commitados
- [ ] `.env` está no `.gitignore`
- [ ] Variáveis sensíveis definidas no painel do Vercel/Railway
- [ ] CORS configurado apenas para domínios necessários

---

## ✅ Checklist Final

- [ ] Pode fazer clone do repositório e rodar em novo PC
- [ ] Documentação é auto-suficiente (não precisa de help externo)
- [ ] Projeto segue conventions (naming, structure, etc)
- [ ] Código está bem comentado em pontos complexos
- [ ] Equipe inteira consegue rodar o projeto
- [ ] CI/CD pipeline está pronto (se aplicável)
- [ ] Backups foram feitos
- [ ] Plano de rollback definido

---

## 📝 Notas

Use este espaço para anotações sobre a validação:

```
Data: _______________
Pessoa: _______________
Observações:
___________________
___________________
___________________
```

---

## 🎉 Sucesso!

Se marcou ✅ em tudo, seu projeto está pronto para:
- ✅ Desenvolvimento contínuo
- ✅ Deploy em produção
- ✅ Compartilhar com a equipe
- ✅ Escalar para mais funcionalidades

**Parabéns! 🚀**

