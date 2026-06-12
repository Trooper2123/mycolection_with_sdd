# Guia de Deployment - MyCollection BFF + Vercel

## 📋 Visão Geral

Este guia descreve como fazer o deploy da aplicação MyCollection usando:
- **Frontend + BFF**: Vercel
- **Backend**: Railway, Render ou AWS

## 🔧 Pré-requisitos

- Conta Vercel (https://vercel.com)
- Conta Railway (https://railway.app) ou Render (https://render.com)
- Git configurado
- Node.js 22+
- Java 21+
- Gradle 8+

---

## 1️⃣ Deploy do Backend no Railway

### 1.1 preparar o Backend

1. Faça um fork do repositório ou crie um repositório privado no GitHub
2. Configure o banco de dados para PostgreSQL (em produção)
3. Adicione um `Procfile` na raiz do projeto backend:

```
web: java -Dserver.port=$PORT -jar build/libs/mycolection-0.1.1.jar
```

### 1.2 Pushear para Git

```bash
git add .
git commit -m "Setup para deploy"
git push origin main
```

### 1.3 Deploy no Railway

1. Acesse https://railway.app
2. Clique em "New Project" → "Deploy from GitHub"
3. Selecione seu repositório
4. Selecione o diretório `backend`
5. Configure variáveis de ambiente:
   - `PORT`: 8080
   - `SPRING_PROFILES_ACTIVE`: production
6. Clique em "Deploy"

**URLs do Backend**:
- Production: `https://seu-backend-railway.railway.app`

---

## 2️⃣ Deploy do BFF + Frontend no Vercel

### 2.1 Estrutura de Projeto (importante)

Para fazer deploy do BFF e Frontend juntos no Vercel, a estrutura deve ser:

```
mycolection_with_sdd/
├── backend/                (ignorado para Vercel)
├── bff/                    (será buildado)
│   ├── src/
│   ├── build.gradle
│   └── ...
├── frontend/              (será buildado)
│   ├── src/
│   ├── package.json
│   └── ...
├── vercel.json            (configuração do Vercel)
└── build.gradle
```

### 2.2 Criar arquivo `vercel.json`

Na raiz do repositório, crie `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build:all",
  "projects": [
    {
      "name": "mycolection-frontend",
      "rootDirectory": "frontend",
      "outputDirectory": "dist",
      "buildCommand": "npm run build"
    }
  ],
  "env": {
    "CORE_API_BASE_URL": "@core_api_base_url"
  }
}
```

### 2.3 Atualizar `package.json` na raiz

Na raiz do projeto, crie um `package.json`:

```json
{
  "name": "mycolection-vercel",
  "version": "1.0.0",
  "scripts": {
    "build:all": "npm --prefix frontend run build",
    "start": "npm --prefix frontend run start"
  }
}
```

### 2.4 Configurar BFF para Vercel

**Criar `bff/vercel.json`**:

```json
{
  "buildCommand": "gradle build",
  "runtime": "java21",
  "memory": 512
}
```

**Ou usar Docker**. Crie `bff/Dockerfile`:

```dockerfile
# Build stage
FROM gradle:8.5-jdk21 as builder
WORKDIR /workspace
COPY . .
RUN gradle build -x test

# Runtime stage
FROM openjdk:21-slim
COPY --from=builder /workspace/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2.5 Configurar Frontend

**Atualizar `frontend/src/environments/environment.prod.ts`**:

```typescript
export const environment = {
  production: true,
  apiUrl: process.env['CORE_API_BASE_URL'] || 'https://seu-bff-railway.railway.app'
};
```

**Atualizar `frontend/src/environments/environment.ts`**:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081'
};
```

**Instanciar no `frontend/src/app/services/item-api.service.ts`**:

```typescript
import { environment } from '../../../environments/environment';

@Injectable()
export class ItemApiService {
  private apiUrl = `${environment.apiUrl}/bff/itens`;
  
  // ... resto do código
}
```

### 2.6 Deploy no Vercel

**Opção A: Via GitHub (Recomendado)**

1. Faça push para o GitHub
2. Acesse https://vercel.com/new
3. Importe seu repositório GitHub
4. Defina as seguintes configurações:
   - Framework: `Other`
   - Root Directory: `./`
   - Build Command: `npm run build:all`
   - Output Directory: `frontend/dist`
5. Configure variáveis de ambiente:
   - `CORE_API_BASE_URL`: URL do BFF (`https://seu-bff.app`)
6. Clique em "Deploy"

**Opção B: Via CLI**

```bash
npm install -g vercel
vercel
# Siga as instruções interativas
```

### 2.7 Configurar Variáveis de Ambiente no Vercel

Dashboard do Vercel → Settings → Environment Variables

```
CORE_API_BASE_URL = https://seu-backend-railway.railway.app
```

---

## 3️⃣ Configurar CORS para Produção

No `bff/src/main/java/br/com/acervo/bff/config/CorsConfig.java`:

```java
@Bean
public CorsWebFilter corsWebFilter() {
    CorsConfiguration config = new CorsConfiguration();
    
    String[] allowedOrigins = {
        "http://localhost:4200",                    // Dev local
        "http://localhost:8081",                    // Dev local BFF
        "https://seu-vercel-frontend.vercel.app",  // Prod Vercel
        "https://seu-dominio-custom.com"           // Domínio custom (se tiver)
    };
    
    config.setAllowedOrigins(Arrays.asList(allowedOrigins));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(false);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    
    return new CorsWebFilter(source);
}
```

---

## 4️⃣ Configurar Backend para Produção

**Criar `backend/src/main/resources/application-production.properties`**:

```properties
server.port=8080
spring.application.name=mycolection-backend
logging.level.org.springframework=WARN

# Database (PostgreSQL em produção)
spring.datasource.url=jdbc:postgresql://localhost:5432/mycolection
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# H2 (apenas para dev)
spring.h2.console.enabled=false
```

---

## 5️⃣ Checklist de Deploy

### Antes de fazer deploy:

- [ ] Backend testado localmente com `gradlew bootRun`
- [ ] BFF testado localmente com `gradlew bootRun`
- [ ] Frontend testado localmente com `npm start`
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Git repository criado e código commitado
- [ ] Dockerfile criado para BFF (se necessário)
- [ ] CORS configurado para produção
- [ ] Certificados SSL/TLS configurados

### Após deploy:

- [ ] Testar todos os endpoints via Insomnia/Postman
- [ ] Verificar logs no console do Vercel/Railway
- [ ] Testar frontend em produção
- [ ] Validar CORS entre domínios
- [ ] Configurar CI/CD para deploys automáticos (GitHub Actions)

---

## 🔍 Troubleshooting

### Erro: CORS Blocked
**Solução**: Verifique `CorsConfig.java` e adicione sua URL de frontend aos `allowedOrigins`

### Erro: Cannot connect to backend
**Solução**: Verifique se a variável `CORE_API_BASE_URL` está correta e Backend está rodando

### Erro: 502 Bad Gateway
**Solução**: Verifique logs do Vercel (`vercel logs`) e Railway

### Frontend não carrega dados
**Solução**: Abra DevTools → Console e procure por CORS ou erros de rede

---

## 📚 Referências

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Spring Boot Production: https://spring.io/guides/gs/spring-boot-docker/
- Angular Production Build: https://angular.io/guide/build

---

### Suporte

Para mais informações, consulte `ARCHITECTURE.md` e `README.md`

