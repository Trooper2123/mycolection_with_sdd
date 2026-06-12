# Arquitetura do Projeto MyCollection com BFF

## Visão Geral

O projeto foi simplificado seguindo o padrão de arquitetura **Backend for Frontend (BFF)**, garantindo separação clara de responsabilidades e facilitando o deployment escalável.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Angular                      │
│               (Publicado no Vercel)                      │
│                   localhost:4200                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   BFF (Proxy Layer)                      │
│              Spring Boot WebFlux                         │
│    (Localhost:8081 | Cloud: Vercel/Railway/Render)      │
│                                                          │
│  • Faz proxy das requisições do frontend                │
│  • Encapsula a complexidade da API interna             │
│  • Enriquece dados (enums, labels, status)             │
│  • Centraliza CORS                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                Backend Java (Core API)                   │
│              Spring Boot + JPA + H2                      │
│           (Localhost:8080 | Cloud: Railway/AWS)        │
│                                                          │
│  • Lógica de negócio                                    │
│  • Persistência de dados                                │
│  • CRUD de itens                                        │
└─────────────────────────────────────────────────────────┘
```

## Componentes

### 1. **Backend** (`backend/`)
- **Framework**: Spring Boot 3.2.0
- **Database**: H2 (desenvolvimento) / PostgreSQL (produção)
- **API**: REST completa com Swagger
- **Responsabilidades**:
  - Lógica de negócio
  - Persistência de dados
  - Validações de domínio
- **Porta**: 8080

### 2. **BFF** (`bff/`)
- **Framework**: Spring Boot 3.2.0 + WebFlux (reativo)
- **Cliente HTTP**: WebClient (reativo)
- **API**: Proxy do frontend
- **Responsabilidades**:
  - Orquestração de chamadas ao backend
  - Enriquecimento de dados para o frontend
  - Tratamento centralizado de CORS
  - Transformação de DTOs
- **Porta**: 8081

### 3. **Frontend** (`frontend/`)
- **Framework**: Angular 18+
- **Build Tool**: npm/Node.js
- **Deployment**: Vercel
- **API Client**: Chamadas apenas ao BFF (localhost:8081)
- **Porta de desenvolvimento**: 4200

## Fluxo de Requisições

1. **Frontend Angular** envia requisição para `http://localhost:8081/bff/itens`
2. **BFF** recebe a requisição:
   - Valida os parâmetros
   - Faz uma chamada ao **Backend** (http://localhost:8080/itens)
3. **Backend** processa:
   - Lógica de negócio
   - Acesso ao banco de dados
   - Retorna resposta
4. **BFF** enriquece a resposta:
   - Adiciona campos derivados (statusEmprestimo, labelTipoMidia)
   - Transforma DTOs
5. **Frontend** recebe dados formatados e renderiza

## Benefícios desta Arquitetura

✅ **Separação de responsabilidades** - Cada camada tem seu propósito claro  
✅ **Escalabilidade** - Cada serviço pode ser deployado independentemente  
✅ **Facilita testes** - Cada camada pode ser testada isoladamente  
✅ **Compatível com Vercel** - BFF pode rodar em função serverless  
✅ **CORS centralizado** - Gerenciado apenas no BFF  
✅ **Segurança** - Backend não exposto diretamente ao frontend  
✅ **Manutenibilidade** - Código mais limpo e organizado

## Endpoints do BFF

### Itens
- `GET /bff/itens` - Listar com paginação e filtro
- `POST /bff/itens` - Criar novo item
- `PUT /bff/itens/{id}` - Atualizar item
- `DELETE /bff/itens/{id}` - Remover item
- `POST /bff/itens/{id}/emprestar` - Registrar empréstimo
- `POST /bff/itens/{id}/devolver` - Registrar devolução

**Documentação interativa**: Acesse `http://localhost:8081/swagger-ui/index.html`

## DTOs Transformados pelo BFF

### ItemBffResponseDTO (enriquecido)
```json
{
  "id": 1,
  "nome": "Harry Potter",
  "tipoMidia": "LIVRO",
  "labelTipoMidia": "Livro",        // ← Adicionado pelo BFF
  "categorias": ["Fantasia", "Ficção Científica"],
  "statusEmprestimo": "Disponível",  // ← Adicionado pelo BFF
  "descricao": "Série de livros",
  "tags": ["magia", "aventura"],
  "dataRetirada": null,
  "dataDevolucao": null,
  "perdido": false,
  "justificativaPerda": null
}
```

## Configuração de Ambiente

### Desenvolvimento Local
```bash
# Terminal 1 - Backend
cd backend
..\gradlew.bat bootRun

# Terminal 2 - BFF
cd bff
..\gradlew.bat bootRun

# Terminal 3 - Frontend
cd frontend
npm install
npm start
```

### Variáveis de Ambiente

**BFF (`bff/src/main/resources/application.properties`)**
```properties
server.port=8081
core-api.base-url=http://localhost:8080  # URL do backend
```

**Frontend (`frontend/.env` ou variáveis de build)**
```properties
API_URL=http://localhost:8081
```

## Próximos Passos para Vercel

1. **Backend**: Deploy em Railway, Render ou AWS
2. **BFF**: Deploy em Vercel (como função serverless)
3. **Frontend**: Deploy em Vercel

Ver `DEPLOY.md` para mais detalhes.

