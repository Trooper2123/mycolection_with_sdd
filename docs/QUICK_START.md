# 🚀 Quick Start - MyCollection BFF

Guia rápido para começar com o projeto!

---

## ⚡ Em 5 minutos

### 1. Clone e Prepare
```bash
cd seu-diretorio
git clone <repositorio>
cd mycolection_with_sdd
```

### 2. Inicie os Serviços (3 terminais separados)

**Terminal 1 - Backend (Porta 8080)**
```bash
cd backend
..\gradlew.bat bootRun
```

**Terminal 2 - BFF (Porta 8081)**
```bash
cd bff
..\gradlew.bat bootRun
```

**Terminal 3 - Frontend (Porta 4200)**
```bash
cd frontend
npm install
npm start
```

### 3. Acesse
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/swagger-ui/index.html
- BFF API: http://localhost:8081/swagger-ui/index.html

---

## 🐳 Com Docker (1 comando)

Se tiver Docker instalado:

```bash
docker-compose up
```

Todos os serviços (backend + BFF) rodando em containers!  
Frontend rode separadamente com `npm start` se quiser hot-reload.

---

## 📝 Operações Comuns

### Build

```bash
# Build apenas backend
cd backend && ..\gradlew.bat clean build

# Build apenas BFF
cd bff && ..\gradlew.bat clean build

# Build apenas frontend
cd frontend && npm run build

# Build tudo
npm run build:all
```

### Testes

```bash
# Testes backend
cd backend && ..\gradlew.bat test

# Testes BFF
cd bff && ..\gradlew.bat test

# Testes frontend
cd frontend && npm test
```

### Ver Logs

```bash
# Backend logs (já aparecem no console)
# BFF logs (já aparecem no console)

# Se usar Docker
docker-compose logs -f backend
docker-compose logs -f bff
```

### Limpar

```bash
# Limpar backend
cd backend && ..\gradlew.bat clean

# Limpar BFF
cd bff && ..\gradlew.bat clean

# Limpar node_modules
cd frontend && npm clean

# Parar containers Dockerdocker-compose down
```

---

## 🌐 Endpoints Principais

### BFF (Frontend acessa aqui)
```
GET    /bff/itens                - Listar itens
POST   /bff/itens                - Criar item
PUT    /bff/itens/{id}           - Atualizar item
DELETE /bff/itens/{id}           - Deletar item
POST   /bff/itens/{id}/emprestar - Emprestar
POST   /bff/itens/{id}/devolver  - Devolver
```

### Backend (BFF acessa aqui)
```
GET    /itens                    - Listar itens
POST   /itens                    - Criar item
PUT    /itens/{id}               - Atualizar item
DELETE /itens/{id}               - Deletar item
POST   /itens/{id}/emprestar     - Emprestar
POST   /itens/{id}/devolver      - Devolver
```

---

## 🔍 Testando com cURL

```bash
# Listar itens
curl http://localhost:8081/bff/itens

# Criar item
curl -X POST http://localhost:8081/bff/itens \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Harry Potter",
    "tipoMidia": "LIVRO",
    "categorias": ["Fantasia"],
    "descricao": "Série de livros"
  }'

# Emprestar
curl -X POST http://localhost:8081/bff/itens/1/emprestar

# Devolver
curl -X POST http://localhost:8081/bff/itens/1/devolver

# Deletar
curl -X DELETE http://localhost:8081/bff/itens/1
```

---

## 📚 Para Saber Mais

| Documento | O quê |
|-----------|-------|
| [README.md](README.md) | Visão geral completa |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura BFF |
| [DEPLOY.md](DEPLOY.md) | Deploy em produção |
| [FRONTEND_CONFIG.md](FRONTEND_CONFIG.md) | Configurar frontend |
| [SIMPLIFICATION_GUIDE.md](SIMPLIFICATION_GUIDE.md) | O que foi simplificado |

---

**Sucesso! 🎉 Você está pronto para desenvolver!**

Dúvidas? Consulte a documentação ou procure na pasta `specs/`.

