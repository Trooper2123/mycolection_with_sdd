# 📐 Arquitetura Visual - MyCollection BFF

## Visão Geral da Arquitetura 3-Camadas

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                              ┃
┃                    🌐 FRONTEND ANGULAR                       ┃
┃                                                              ┃
┃  • Interface para usuário                                   ┃
┃  • Roda em http://localhost:4200                           ┃
┃  • Conecta apenas ao BFF                                   ┃
┃  • Publicado: Vercel                                        ┃
┃                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                      │
                      │ HTTP Request
                      │ /bff/itens
                      ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                              ┃
┃            🌉 BFF - BACKEND FOR FRONTEND                     ┃
┃                                                              ┃
┃  Spring Boot 3.2 + WebFlux (Reativo)                        ┃
┃  Roda em http://localhost:8081                             ┃
┃                                                              ┃
┃  Responsabilidades:                                          ┃
┃  ✓ Proxy de requisições                                      ┃
┃  ✓ Orquestração de dados                                     ┃
┃  ✓ Enriquecimento (campos derivados)                        ┃
┃  ✓ CORS centralizado                                         ┃
┃  ✓ Transformação de DTOs                                     ┃
┃  ✓ Validação de entrada                                      ┃
┃                                                              ┃
┃  Componentes:                                                ┃
┃  ├─ ItemBffController (/bff/itens)                          ┃
┃  ├─ ItemBffService (orquestração)                           ┃
┃  ├─ CoreApiClient (HTTP ao backend)                         ┃
┃  ├─ CorsConfig (permite localhost:4200)                     ┃
┃  └─ WebClientConfig (WebClient reativo)                     ┃
┃                                                              ┃
┃  Publicado: Vercel / Railway / Render                       ┃
┃                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                      │
                      │ HTTP Request
                      │ /itens
                      ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                              ┃
┃            🖥️ BACKEND - CORE API                             ┃
┃                                                              ┃
┃  Spring Boot 3.2 + JPA/Hibernate                            ┃
┃  Roda em http://localhost:8080                             ┃
┃                                                              ┃
┃  Responsabilidades:                                          ┃
┃  ✓ Lógica de negócio                                         ┃
┃  ✓ Persistência de dados                                     ┃
┃  ✓ Validações de domínio                                     ┃
┃  ✓ CRUD completo                                             ┃
┃  ✓ Empréstimo/Devolução                                      ┃
┃                                                              ┃
┃  Componentes:                                                ┃
┃  ├─ ItemController (/itens)                                 ┃
┃  ├─ ItemService (lógica negócio)                            ┃
┃  ├─ ItemRepository (acesso dados)                           ┃
┃  ├─ Item (entidade JPA)                                     ┃
┃  ├─ ItemMapper (transformação)                              ┃
┃  └─ RestExceptionHandler (erros)                            ┃
┃                                                              ┃
┃  Database:                                                   ┃
┃  ├─ H2 (development)                                         ┃
┃  └─ PostgreSQL (production)                                  ┃
┃                                                              ┃
┃  Publicado: Railway / Render / AWS                          ┃
┃                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## Fluxo de uma Requisição GET /itens

```
1️⃣ FRONTEND ANGULAR (localhost:4200)
   ┌─────────────────────────────────┐
   │ ItemApiService.list()           │
   │ GET /bff/itens?category=Ficção  │
   └─────────────────┬───────────────┘
                     │
                     │ HTTP GET
                     ▼
2️⃣ BFF (localhost:8081)
   ┌─────────────────────────────────┐
   │ ItemBffController.list()        │
   │ Recebe: page, size, categoria   │
   └─────────────────┬───────────────┘
                     │
                     │ Chama service
                     ▼
   ┌─────────────────────────────────┐
   │ ItemBffService.list()           │
   │ → Chama CoreApiClient           │
   └─────────────────┬───────────────┘
                     │
                     │ HTTP GET (WebClient)
                     ▼
3️⃣ BACKEND (localhost:8080)
   ┌─────────────────────────────────┐
   │ ItemController.list()           │
   │ Acessa banco de dados           │
   └─────────────────┬───────────────┘
                     │
                     │ SQL SELECT
                     ▼
   ┌─────────────────────────────────┐
   │ DATABASE (H2/PostgreSQL)        │
   │ Retorna lista de itens          │
   └─────────────────┬───────────────┘
                     │
                     │ CoreItemResponseDTO
                     ▼
4️⃣ BFF ENRIQUECIMENTO
   ┌─────────────────────────────────┐
   │ ItemBffService.enrich()         │
   │ Adiciona campos derivados:      │
   │ - statusEmprestimo              │
   │ - labelTipoMidia                │
   └─────────────────┬───────────────┘
                     │
                     │ ItemBffResponseDTO
                     │ (enriquecido)
                     ▼
5️⃣ FRONTEND ANGULAR
   ┌─────────────────────────────────┐
   │ Recebe dados enriquecidos       │
   │ Renderiza na UI                 │
   │ ✓ Sucesso!                      │
   └─────────────────────────────────┘
```

---

## Endpoints e Fluxo de Dados

### CREATE - Exemplo: novo Item

```
Frontend                    BFF                     Backend
   │                        │                         │
   │ POST /bff/itens        │                         │
   │ ItemBffRequestDTO      │                         │
   ├─────────────────────>  │                         │
   │                        │ POST /itens             │
   │                        │ ItemBffRequestDTO       │
   │                        ├────────────────────────>│
   │                        │                         │ Valida
   │                        │                         │ Salva DB
   │                        │ CoreItemResponseDTO     │
   │                        │<────────────────────────┤
   │                        │ Enriquece               │
   │ ItemBffResponseDTO     │ + statusEmprestimo     │
   │<─────────────────────┤ + labelTipoMidia        │
   │ ✓ 200 OK             │                         │
   │                        │                         │
```

### DELETE - Exemplo: Deletar Item

```
Frontend                    BFF                     Backend
   │                        │                         │
   │ DELETE /bff/itens/1    │                         │
   │ {justificativa: "..."}│                         │
   ├─────────────────────>  │                         │
   │                        │ DELETE /itens/1         │
   │                        │ {justificativa: "..."} │
   │                        ├────────────────────────>│
   │                        │                         │ Marca perdido
   │                        │                         │ ou deleta
   │                        │ 204 No Content          │
   │                        │<────────────────────────┤
   │                        │ Deleta OK               │
   │ 204 No Content         │                         │
   │<─────────────────────┤                         │
   │ ✓ Item deletado        │                         │
```

---

## Estrutura de Pastas e Responsabilidades

```
mycolection_with_sdd/
│
├── 📁 backend/                    [CORE API - Lógica de Negócio]
│   ├── src/main/java/...
│   │   ├── controller/            → Recebe requisições REST
│   │   ├── service/               → Implementa lógica negócio
│   │   ├── repository/            → Acessa banco de dados
│   │   ├── model/                 → Entidades JPA
│   │   ├── dto/                   → Data transfer objects
│   │   ├── mapper/                → Transforma dados
│   │   ├── exception/             → Tratamento de erros
│   │   └── config/                → Configurações Spring
│   │
│   └── application.properties     → Config: porta 8080, H2
│
├── 📁 bff/                        [PROXY LAYER - Intermediário]
│   ├── src/main/java/br/com/acervo/bff/
│   │   ├── controller/            → REST endpoints /bff/...
│   │   │   └── ItemBffController  → Único entry point frontend
│   │   │
│   │   ├── service/               → Orquestração de requests
│   │   │   └── ItemBffService     → Enriquecimento dados
│   │   │
│   │   ├── client/                → HTTP ao backend
│   │   │   ├── CoreApiClient      → WebClient reativo
│   │   │   └── dto/               → DTOs do backend
│   │   │
│   │   ├── dto/                   → DTOs do BFF (enriquecidos)
│   │   │   ├── ItemBffRequestDTO
│   │   │   ├── ItemBffResponseDTO
│   │   │   └── PageBffResponse
│   │   │
│   │   └── config/                → Configurações
│   │       ├── CorsConfig         → CORS centralizado
│   │       └── WebClientConfig    → WebClient bean
│   │
│   ├── Dockerfile                 → Build Docker
│   └── application.properties     → Config: porta 8081, backend URL
│
├── 📁 frontend/                   [ANGULAR UI - Apresentação]
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        → Componentes Angular
│   │   │   ├── services/          → Serviços HTTP
│   │   │   │   └── item-api.service.ts → Chama /bff/itens
│   │   │   ├── models/            → Interfaces TypeScript
│   │   │   └── app.component.ts   → Root component
│   │   │
│   │   ├── index.html             → HTML raiz
│   │   └── main.ts                → Bootstrap Angular
│   │
│   ├── package.json               → Dependências npm
│   ├── angular.json               → Config build
│   └── tsconfig.json              → Config TypeScript
│
├── 📁 gradle/                     → Wrapper Gradle
│
├── 📁 specs/                      → Especificações/planes
│
├── 📄 README.md                   → Documentação principal
├── 📄 QUICK_START.md              → Inicie rapidinho
├── 📄 ARCHITECTURE.md             → Detalhes arquitetura
├── 📄 DEPLOY.md                   → Deploy produção
├── 📄 docker-compose.yml          → Compose local
├── 📄 vercel.json                 → Config Vercel
├── 📄 package.json                → Scripts npm
└── 📄 .env.example                → Template env

```

---

## Ciclo de Vida de uma Requisição Completa

```
┌────────────────────────────────────────────────────────────┐
│                    FASE 1: REQUEST                          │
└────────────────────────────────────────────────────────────┘

1. Browser (localhost:4200)
   └─> User clica "Listar Itens"
   └─> Angular chama ItemApiService
   └─> GET http://localhost:8081/bff/itens?page=0

2. Network (HTTP GET)
   └─> Browser envia request
   └─> BFF recebe em ItemBffController

┌────────────────────────────────────────────────────────────┐
│                   FASE 2: PROCESSING                        │
└────────────────────────────────────────────────────────────┘

3. BFF (ItemBffController)
   └─> Valida parâmetros (page, size, categoria)
   └─> Chama ItemBffService.list()

4. BFF (ItemBffService)
   └─> Chama CoreApiClient.list()
   └─> CoreApiClient faz WebClient.get() ao backend

5. Backend (ItemController)
   └─> Recebe request em /itens?page=0&size=10
   └─> Chama ItemService.list()
   └─> ItemService faz queries ao banco

6. Database (H2/PostgreSQL)
   └─> Executa SELECT * FROM itens LIMIT 10
   └─> Retorna lista de itens

┌────────────────────────────────────────────────────────────┐
│                   FASE 3: ENRICHMENT                        │
└────────────────────────────────────────────────────────────┘

7. BFF (ItemBffService.enrich())
   └─> Para cada item recebido do backend:
   └─> Calcula statusEmprestimo (Disponível/Emprestado/Perdido)
   └─> Converte TipoMidia enum em label português
   └─> Constrói ItemBffResponseDTO enriquecido

8. BFF (ItemBffController)
   └─> Retorna ResponseEntity<PageBffResponse>
   └─> Headers CORS inclusos (Access-Control-Allow-Origin)

┌────────────────────────────────────────────────────────────┐
│                   FASE 4: RESPONSE                          │
└────────────────────────────────────────────────────────────┘

9. Network (HTTP 200)
   └─> JSON com dados enriquecidos é transmitido

10. Frontend (Angular)
    └─> Recebe JSON em ItemApiService
    └─> Converte para modelo TypeScript
    └─> Component renderiza dados na UI
    └─> User vê lista de itens ✓

┌────────────────────────────────────────────────────────────┐
│                    FASE 5: RENDER                           │
└────────────────────────────────────────────────────────────┘

11. Browser (DOM Update)
    └─> Angular renderiza lista
    └─> CSS estilos aplicados
    └─> User interage com dados ✓
```

---

## Diagrama de Deployment (Produção)

```
INTERNET
   │
   ├─────────────────────────────────────────────────────────┐
   │                                                          │
   ▼                                                          │
┌─────────────────────────┐                                  │
│   Vercel (Frontend)     │                                  │
│ myapp.vercel.app        │                                  │
│                         │                                  │
│ • Angular build         │                                  │
│ • Static files          │                                  │
│ • Auto-scaling          │                                  │
└─────────────────────────┘                                  │
   │                                                          │
   │ HTTPS Request                                           │
   │ /bff/itens                                              │
   ▼                                                          │
┌──────────────────────────────────┐                         │
│   Vercel (BFF) OR Railway        │                         │
│ bff-app.vercel.app               │                         │
│ bff-app.railway.app              │                         │
│                                  │                         │
│ • Spring Boot container          │                         │
│ • WebFlux                        │                         │
│ • Auto-scaling memory 512MB+     │                         │
└──────────────────────────────────┘                         │
   │                                                          │
   │ HTTP Request                                            │
   │ /itens                                                  │
   ▼                                                          │
┌──────────────────────────────────┐                         │
│   Railway/Render (Backend)       │                         │
│ backend-app.railway.app          │                         │
│ backend-app.onrender.com         │                         │
│                                  │                         │
│ • Spring Boot Java               │                         │
│ • JPA + Hibernate               │                         │
│ • PostgreSQL connection          │                         │
└──────────────────────────────────┘                         │
   │                                                          │
   │ JDBC Connection                                         │
   ▼                                                          │
┌──────────────────────────────────┐                         │
│   PostgreSQL (Cloud)             │                         │
│ database.railway.app             │                         │
│ (ou AWS RDS)                     │                         │
│                                  │                         │
│ • Dados persistidos              │                         │
│ • Backups automáticos            │                         │
└──────────────────────────────────┘                         │
                                                              │
└──────────────────────────────────────────────────────────►│

                         ✅ PRONTO PARA ESCALA!
```

---

## Benefícios da Arquitetura BFF

```
SEM BFF (❌ Problemático)           COM BFF (✅ Ideal)
┌────────────────────────┐         ┌────────────────────────┐
│ Frontend               │         │ Frontend               │
│ ├─ Chama /itens       │         │ ├─ Chama /bff/itens   │
│ ├─ 3 endpoints        │         │ └─ 1 único entry point│
│ ├─ Backend exposto    │         │                        │
│ └─ CORS needed        │         │ BFF                    │
│                       │────────▶│ ├─ Proxy               │
│ Problema:            │         │ ├─ Orquestra           │
│ ✗ CORS complic      │         │ ├─ Enriquece           │
│ ✗ Frontend tightly   │         │ └─ CORS centralizado   │
│ ✗ Backend vulnerável │         │                        │
│ ✗ Dados incompletos │         │ Backend                │
└────────────────────────┘         │ ├─ Clean logic        │
                                   │ ├─ DB protected       │
                                   │ └─ Only data APIs     │
                                   │                        │
                                   │ Benefícios:            │
                                   │ ✓ Seguro              │
                                   │ ✓ Flexível            │
                                   │ ✓ Escalável           │
                                   │ ✓ Maintível           │
                                   └────────────────────────┘
```

---

## Próximas Etapas

```
┌─────────────────────────┐
│ 1. Desenvolver Local    │ ← [Você está aqui]
│    • 3 terminais        │
│    • Docker Compose     │
│    • Validar tudo       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. Deploy Backend       │
│    • Railway/Render     │
│    • PostgreSQL setup   │
│    • CI/CD pipeline     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 3. Deploy BFF           │
│    • Vercel/Railway     │
│    • Env vars config    │
│    • Testes end-to-end  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 4. Deploy Frontend      │
│    • Vercel             │
│    • Custom domain      │
│    • Monitoring         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 5. Go Live! 🚀          │
│    ✓ Production ready   │
│    ✓ Auto-scaling       │
│    ✓ Monitoring active  │
└─────────────────────────┘
```

---

**Arquitetura pronta! Quer ver o código? Acesse os diretórios backend/, bff/, frontend/ 📂**

