# MyCollection - Gerenciamento de Acervo com BFF

Aplicação de controle de acervo (livros, quadrinhos, mangás e jogos) com arquitetura **Backend for Frontend (BFF)**, otimizada para deploy em **Vercel**.

> **Nota**: A arquitetura foi simplificada para usar BFF como proxy entre frontend e backend. Veja [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes.

## Cenário 

Precisa que seja desenvolvido um aplicativo de controle de acervo (livros, quadrinhos, mangás e jogos) com sistema de empréstimo e fila de espera.
Cada item pode ter:
Um identificador único.
Um nome 
tipo de mídia
uma ou mais categorias
data de retirada 
data de devolução (1 mês após retirada)
Atributos opcionais (como descrição ou tags).

Objetivo
Criar a base para a aplicação (front e back), com funcionalidades básicas.

Critérios funcionais
Arquitetura deve ser simples e limpa;
Código deve ser escrito em Java utilizando Spring e Gradle
Utilizar banco de dados local (h2)
Deve conter testes

Critérios de sucesso
Implementar um CRUD completo para a gestão de itens, cumprindo os seguintes requisitos:
*Listar itens com filtro de categoria
 A partir dessa lista completa, implemente um novo filtro para listar os itens por categoria e adicione paginação aos resultados.
*Modificar item existente: desenvolva a funcionalidade para atualizar os dados de um item. Deve ser possível atualizar o nome, a categoria e a descrição de um item.
*Excluir item: implemente a operação que permita remover um item do sistema.
*Criar novo item: adicione a capacidade de criar e registrar um novo item no banco de dados.
A aplicação é executada corretamente no ambiente local por meio de Docker.
A aplicação deve conter um front simples sem login.


## 📦 Componentes

### Backend (`backend/`)
- Spring Boot 3.2.0 + JPA
- Banco H2 (dev) / PostgreSQL (prod)
- CRUD completo de itens
- Porta: 8080

### BFF (`bff/`)
- Spring Boot 3.2.0 + WebFlux (reativo)
- Proxy para o backend
- Enriquecimento de dados
- CORS centralizado
- Porta: 8081

### Frontend (`frontend/`)
- Angular 18+
- npm/Node.js
- Conecta ao BFF (http://localhost:8081)
- Porta dev: 4200
- Publicável no Vercel

## Frontend Angular

Interface Angular em `frontend` com:
- cadastro e edição de itens;
- listagem paginada com filtro por categoria;
- empréstimo e devolução;
- exclusão de item (com justificativa quando emprestado).

## Como Executar (Development)

### Pré-requisitos

- Java 21+
- Gradle 8+
- Node.js 22+ e npm
- Docker (opcional)

### Opção 1: Execução Separada em Terminais (Recomendado para Dev)

**Terminal 1 - Backend:**
```cmd
cd backend
..\gradlew.bat clean bootRun
```
- Backend disponível: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

**Terminal 2 - BFF:**
```cmd
cd bff
..\gradlew.bat clean bootRun
```
- BFF disponível: `http://localhost:8081`
- Swagger UI: `http://localhost:8081/swagger-ui/index.html`

**Terminal 3 - Frontend Angular:**
```cmd
cd frontend
npm install
npm start
```
- Frontend disponível: `http://localhost:4200`

### Opção 2: Docker Compose (Todos os serviços juntos)

```cmd
docker-compose up
```

- Backend: `http://localhost:8080`
- BFF: `http://localhost:8081`
- Frontend: Configure para usar o BFF em `http://localhost:8081`

### Build e Testes

**Build completo (backend + BFF):**
```cmd
..\gradlew.bat clean build
```

**Build apenas backend:**
```cmd
cd backend
..\gradlew.bat clean build
```

**Build apenas BFF:**
```cmd
cd bff
..\gradlew.bat clean build
```

**Build apenas frontend:**
```cmd
cd frontend
npm run build
```

**Testes backend:**
```cmd
cd backend
..\gradlew.bat test
```

**Testes BFF:**
```cmd
cd bff
..\gradlew.bat test
```

**Testes frontend:**
```cmd
cd frontend
npm test
```

## 🏗️ Arquitetura BFF

O projeto utiliza arquitetura **BFF (Backend for Frontend)** com três camadas:

```
Frontend Angular (Vercel) 
    ↓
BFF - Spring Boot WebFlux (Vercel/Railway/Render)
    ↓
Backend Java - Spring Boot (Railway/Render/AWS)
```

**Benefícios:**
- ✅ Separação clara de responsabilidades
- ✅ Escalabilidade independente
- ✅ CORS centralizado no BFF
- ✅ Fácil para publicar no Vercel
- ✅ Backend protegido (não exposto ao frontend)

Veja [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes completos.

## 🚀 Deployment

### Quick Start - Deploy no Vercel

1. **Faça fork/clone** do repositório
2. **Configure o Backend** em Railway/Render
3. **Push para GitHub**
4. **Acesse** https://vercel.com/new e importe o repositório
5. **Configure variáveis de ambiente**:
   - `CORE_API_BASE_URL`: URL do seu backend

Para instruções detalhadas, veja [DEPLOY.md](DEPLOY.md)

### Estrutura de Deploy

| Componente | Plataforma | Ambiente |
|-----------|-----------|----------|
| **Frontend** | Vercel | Produção |
| **BFF** | Vercel / Railway | Produção |
| **Backend** | Railway / Render / AWS | Produção |

### Docker Compose (Local com todos os serviços)

```cmd
docker-compose up
```

Todos os serviços rodando localmente com apenas um comando! 🎉

## 📚 Documentação

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detalhes da arquitetura BFF
- [DEPLOY.md](DEPLOY.md) - Guia completo de deployment
- [RUNNING.md](RUNNING.md) - Instruções adicionais de execução

## 🔗 Links Úteis

- Swagger UI Backend: `http://localhost:8080/swagger-ui/index.html`
- Swagger UI BFF: `http://localhost:8081/swagger-ui/index.html`
- Frontend: `http://localhost:4200`

---

**Status**: Pronto para produção ✅  
**Versão**: 1.0.0  
**Última atualização**: Junho 2026

