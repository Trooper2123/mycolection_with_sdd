# 🔧 Troubleshooting Guide - MyCollection BFF

Guia completo para resolver problemas comuns.

---

## 🔴 Problemas de Execução Local

### Problema: Port já em uso (Port 8080/8081 in use)

**Erro Comum**:
```
java.net.BindException: Address already in use: bind
java.io.IOException: Failed to bind to 0.0.0.0/0.0.0.0:8080
```

**Causas**:
- Outro processo Java rodando
- Backend/BFF já em execução em outro terminal
- Outra aplicação usando a mesma porta

**Soluções**:

1. **Matar processo na porta (PowerShell)**:
```powershell
# Ver processo na porta 8080
netstat -ano | findstr :8080

# Matar processo (retire o :8080 ouno final)
taskkill /PID <PID> /F

# Ou para BFF na 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

2. **Mudar porta no `application.properties`**:
```properties
# backend/src/main/resources/application.properties
server.port=8090  # em vez de 8080

# bff/src/main/resources/application.properties
server.port=8091  # em vez de 8081
core-api.base-url=http://localhost:8090  # aponta para a nova porta
```

3. **No Docker Compose**:
```yaml
services:
  backend:
    ports:
      - "8090:8080"  # Porta local 8090 → container 8080
  bff:
    ports:
      - "8091:8081"
```

---

### Problema: Connection Refused (Backend não encontrado)

**Erro Comum**:
```
java.net.ConnectException: Connection refused: connect
```

**Causa**: Backend não está rodando quando BFF tenta se conectar

**Solução**:

1. **Verificar se backend está rodando**:
```bash
curl http://localhost:8080/swagger-ui/index.html
```

2. **Se não estiver, inicie**:
```bash
cd backend
..\gradlew.bat bootRun
```

3. **Esperar startup completo** (pode levar 30 segundos)

4. **Verificar `core-api.base-url` em BFF**:
```properties
# bff/src/main/resources/application.properties
core-api.base-url=http://localhost:8080
```

---

### Problema: Cannot find Java

**Erro**:
```
'java' is not recognized as an internal or external command
```

**Solução**:

1. **Instale Java 21**:
   - Download: https://jdk.java.net/21/
   - Siga instruções de instalação

2. **Adicione ao PATH**:
```powershell
# Verificar instalação
java -version

# Se não funcionar, adicione ao PATH
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path += ";$env:JAVA_HOME\bin"
```

3. **Reinicie terminal/IDE**

---

### Problema: Cannot find Gradle

**Erro**:
```
'gradle' or 'gradlew' is not found
```

**Solução**:

1. **Use gradlew (wrapper)**:
```bash
# Em vez de 'gradle'
..\gradlew clean build

# Em vez de 'gradle bootRun'
..\gradlew bootRun
```

2. **Se gradlew não existir**:
```bash
cd seu-modulo
gradle wrapper --gradle-version=8.5
```

---

## 🔴 Problemas Frontend

### Problema: npm: command not found

**Erro**:
```
npm: command not found
```

**Solução**:

1. **Instale Node.js + npm**:
   - Download: https://nodejs.org/
   - Node.js 22+ LTS recomendado

2. **Verificar instalação**:
```bash
node -v
npm -v
```

3. **Adicionar ao PATH** (se necessário)

---

### Problema: Cannot find module @angular/core

**Erro**:
```
Error: Cannot find module '@angular/core'
```

**Solução**:

1. **Instale dependências**:
```bash
cd frontend
npm install
```

2. **Verifique `package.json`** (não dê delete):
```json
"dependencies": {
  "@angular/core": "^18.2.0",
  // ...
}
```

3. **Se persistir, limpe cache**:
```bash
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

---

### Problema: Port 4200 já em uso

**Erro**:
```
Port 4200 is already in use. Use '--port' to specify a different port.
```

**Solução**:

```bash
# Use porta diferente
ng serve --port 5000

# Ou via npm
npm start -- --port 5000

# Depois acesse
http://localhost:5000
```

---

## 🔴 Problemas de Comunicação

### Problema: CORS Block / Cross-Origin Request Blocked

**Erro no Console**:
```
Access to XMLHttpRequest at 'http://localhost:8081/bff/itens' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Causa**: CORS não configurado corretamente no BFF

**Solução**:

1. **Verificar `CorsConfig.java`**:
```java
config.setAllowedOrigins(List.of(
    "http://localhost:4200",     // ← Deve incluir origem do frontend
    "http://localhost:3000",      // etc
    "https://seu-app.vercel.app"  // Production
));
```

2. **Adicionar se necessário**:
```java
// bff/src/main/java/br/com/acervo/bff/config/CorsConfig.java
config.setAllowedOrigins(List.of(
    "http://localhost:4200",
    "http://localhost:5000",  // Se mudou porta
    "https://seu-app.vercel.app"
));
```

3. **Rebuild BFF**:
```bash
cd bff
..\gradlew.bat clean bootRun
```

---

### Problema: 404 Not Found no endpoint

**Erro**:
```
GET http://localhost:8081/bff/itens 404 Not Found
```

**Causas & Soluções**:

1. **BFF não está rodando**:
```bash
cd bff
..\gradlew.bat bootRun
```

2. **Url está errada**:
```typescript
// frontend/src/app/services/item-api.service.ts
// Deve ser:
private readonly apiBaseUrl = 'http://localhost:8081/bff/itens';

// Não:
// private readonly apiBaseUrl = 'http://localhost:8080/itens'; ❌
```

3. **Controller não mapeado corretamente**:
```java
// bff/src/main/java/br/com/acervo/bff/controller/ItemBffController.java
@RequestMapping("/bff/itens")  // ← Verificar caminho
public class ItemBffController { }
```

---

### Problema: 500 Internal Server Error

**Erro**:
```
HTTP 500 Internal Server Error
```

**Solução**:

1. **Verificar logs do BFF**:
```
# No terminal onde BFF está rodando, procure por:
java.lang.NullPointerException
java.lang.IllegalArgumentException
// ... etc
```

2. **Problemas comuns**:

   a) **Backend não está respondendo**:
   ```
   Caused by: java.net.ConnectException: Connection refused
   ```
   → Certifique-se que Backend está em `http://localhost:8080`

   b) **Configuração inválida**:
   ```
   Caused by: org.springframework.beans.factory.BeanCreationException
   ```
   → Verifique `application.properties`

   c) **Request headers inválido**:
   ```
   415 Unsupported Media Type
   ```
   → Frontend deve enviar `Content-Type: application/json`

---

## 🔴 Problemas de Build

### Problema: Build Failed - Compilation errors

**Erro**:
```
BUILD FAILED - Compilation failed; see the compiler error output for details.
```

**Solução**:

1. **Ler erro completo** (procure por `error:`)
2. **Erros comuns**:

   a) **Import inválido**:
   ```java
   error: package org.springframework does not exist
   ```
   → Verifique `build.gradle` - faltam dependências

   b) **Sintaxe inválida**:
   ```
   error: ';' expected
   ```
   → Verifique ponto-e-vírgula no código

   c) **Classe não encontrada**:
   ```
   error: cannot find symbol - class ClassName
   ```
   → Importe corretamente ou crie a classe

3. **Solução geral**:
```bash
cd seu-modulo
..\gradlew clean build
```

---

### Problema: Test Failures

**Erro**:
```
BUILD FAILED - X tests failed
```

**Solução**:

1. **Ler test failure**:
```
java.lang.AssertionError: expected <X> but was <Y>
```

2. **Se não souber o porquê**:
```bash
# Rodear apenas 1 test para debug
cd backend
..\gradlew test --tests NomeDoTestClass.nomeDoTest
```

3. **Checklist**:
- [ ] Banco de dados mockado?
- [ ] Variáveis de ambiente configuradas?
- [ ] Dados de teste existem?
- [ ] Timeouts configurados?

---

## 🔴 Problemas Docker

### Problema: Docker daemon not running

**Erro**:
```
Cannot connect to Docker daemon at unix:///var/run/docker.sock
```

**Solução**:

1. **Inicie Docker Desktop** (Windows/Mac) ou docker service (Linux)

2. **Verifique status**:
```bash
docker ps
docker --version
```

---

### Problema: Port conflict em Docker

**Erro**:
```
docker: Error response from daemon: Ports are not available
```

**Solução**:

1. **Lista containers rodando**:
```bash
docker ps
```

2. **Pare containers específicos**:
```bash
docker stop <CONTAINER_ID>
```

3. **Ou use docker-compose**:
```bash
docker-compose down
```

4. **Se quiser, mude portas em docker-compose.yml**:
```yaml
services:
  backend:
    ports:
      - "8090:8080"  # 8090 local, 8080 no container
```

---

## 🔴 Problemas Production / Vercel

### Problema: Build fails no Vercel

**Erro na dashboard Vercel**:
```
Build failed
```

**Solução**:

1. **Ver logs completos**:
   - Vercel Dashboard → Deployments → Ver logs

2. **Causas comuns**:

   a) **Variáveis de ambiente não definidas**:
   - Settings → Environment Variables
   - Adicione todas as variáveis necessárias

   b) **Build command inválido**:
   - Verifique `vercel.json` ou settings do projeto
   - Deve ser `npm run build` ou equivalente

   c) **Dependencies faltando**:
   - Verifique `package.json` ou `build.gradle`
   - Commits incluem todas as dependências?

---

### Problema: Frontend não conecta ao Backend em Produção

**Erro**: Frontend Vercel mostra erro ao carregar dados

**Solução**:

1. **Verificar URL do backend**:
```typescript
// frontend/src/environments/environment.prod.ts
export const environment = {
  apiUrl: 'https://seu-backend-railway.railway.app'  // ← URL correta?
};
```

2. **Verificar CORS no BFF**:
```java
// bff/src/main/java/br/com/acervo/bff/config/CorsConfig.java
config.setAllowedOrigins(List.of(
    "https://seu-app.vercel.app"  // ← Adicionar origem Vercel
));
```

3. **Testar com cURL**:
```bash
curl https://seu-bff.railway.app/bff/itens
```

---

## 🎯 Checklist de Troubleshooting

Antes de pedir ajuda, marque:

- [ ] Leu o erro completo (não apenas primeira linha)
- [ ] Procurou erro em Google
- [ ] Tentou limpar cache (`.gradle`, `node_modules`)
- [ ] Tentou reiniciar aplicação/terminal
- [ ] Verificou `application.properties` / `package.json`
- [ ] Verificou portas em uso
- [ ] Leu documentação relevante (ARCHITECTURE.md, DEPLOY.md)
- [ ] Executou com `--debug` ou `-v` para mais detalho
- [ ] Testou em terminal/CLI (não apenas IDE)

---

## 📞 Se Ainda Tiver Problemas

1. **Procure documentação**:
   - [README.md](README.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)
   - [DEPLOY.md](DEPLOY.md)

2. **Cole erro completo** em:
   - Stack Overflow
   - Spring Forum
   - Angular Forum
   - GitHub Issues

3. **Incluir contexto**:
   - Sistema operacional
   - Versões (Java, Node, etc)
   - Passos para reproduzir
   - Erro completo
   - Seus logs/outputs

---

## 🎉 Solved!

Se resolveu, considere:
- ✅ Documentar solução em um arquivo pessoal
- ✅ Compartilhar com time
- ✅ Sugerir melhoria na documentação

**Boa sorte! 🍀**

