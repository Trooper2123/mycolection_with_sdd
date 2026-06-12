# Configuração do Frontend Angular para BFF

## 📍 Status Atual

O frontend Angular já está configurado para chamar o BFF em `http://localhost:8081/bff/itens`.

✅ **Arquivo**: `frontend/src/app/services/item-api.service.ts`  
✅ **Endpoint**: `const apiBaseUrl = 'http://localhost:8081/bff/itens';`

---

## 🔧 Como Configurar para Production

### Opção 1: Usar Environment Angular (Recomendado)

#### 1. Crie os arquivos de ambiente

**`frontend/src/environments/environment.ts`** (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081'
};
```

**`frontend/src/environments/environment.prod.ts`** (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://seu-bff.railway.app'
};
```

#### 2. Atualize `angular.json` (se ainda usar assets)
```json
{
  "projects": {
    "mycolection-frontend": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

#### 3. Atualize `ItemApiService`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemRequest, ItemResponse, PageResponse } from '../models/item.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService {
  private readonly apiBaseUrl = `${environment.apiUrl}/bff/itens`;

  constructor(private readonly http: HttpClient) {}

  list(page = 0, size = 10, categoria?: string): Observable<PageResponse<ItemResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (categoria && categoria.trim().length > 0) {
      params = params.set('categoria', categoria.trim());
    }
    return this.http.get<PageResponse<ItemResponse>>(this.apiBaseUrl, { params });
  }

  create(payload: ItemRequest): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(this.apiBaseUrl, payload);
  }

  update(id: number, payload: ItemRequest): Observable<ItemResponse> {
    return this.http.put<ItemResponse>(`${this.apiBaseUrl}/${id}`, payload);
  }

  delete(id: number, justificativa?: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`, {
      body: justificativa?.trim() ? { justificativa: justificativa.trim() } : undefined
    });
  }

  emprestar(id: number): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(`${this.apiBaseUrl}/${id}/emprestar`, {});
  }

  devolver(id: number): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(`${this.apiBaseUrl}/${id}/devolver`, {});
  }
}
```

#### 4. Build para produção
```bash
# Development (usa environment.ts)
npm start

# Production (usa environment.prod.ts)
npm run build
# ou
ng build --configuration production
```

---

### Opção 2: Usar Variáveis de Ambiente do Sistema

Sem usar environments do Angular, você pode ler variáveis do `process.env` direto no build.

**`package.json`**
```json
{
  "scripts": {
    "start": "ng serve",
    "build:prod": "ng build --configuration production && npx set-env --prod",
    "build": "ng build"
  }
}
```

**Ao fazer deploy no Vercel**, defina:
```
API_URL = https://seu-bff.railway.app
```

---

### Opção 3: Usar Global Constants

Se preferir simples, crie um arquivo de configuração:

**`frontend/src/app/config/api.config.ts`**
```typescript
export const API_CONFIG = {
  baseUrl: process.env['API_URL'] || 'http://localhost:8081',
  endpoints: {
    items: '/bff/itens'
  }
};
```

Depois use em qualquer serviço:
```typescript
import { API_CONFIG } from '../config/api.config';

export class ItemApiService {
  private readonly apiBaseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.items}`;
  // ...
}
```

---

## 🔑 Variáveis de Ambiente no Vercel

Quando fizer deploy no Vercel, configure as variáveis:

**Vercel Dashboard → Settings → Environment Variables**

```
API_URL = https://seu-bff-railway.railway.app
CORE_API_BASE_URL = https://seu-backend-railway.railway.app
```

---

## 🧪 Teste Localmente

### 1. Certifique-se que BFF está rodando
```bash
curl http://localhost:8081/swagger-ui/index.html
```

### 2. Rode o frontend
```bash
cd frontend
npm install
npm start
```

### 3. Acesse http://localhost:4200
- Abra DevTools (F12)
- Vá para Network tab
- Tente criar/listar itens
- Veja as requisições para `http://localhost:8081/bff/itens`

### 4. Se houver erro CORS
- Verifique `bff/src/main/java/br/com/acervo/bff/config/CorsConfig.java`
- Adicione sua URL local aos `allowedOrigins`

---

## 📦 Build e Deploy

### Build Local
```bash
npm run build
```

Gera output em `frontend/dist/`

### Deploy Vercel
Vercel detecta `package.json` automaticamente se:
1. Repositório no GitHub
2. `package.json` tem `build` script
3. Output directory é `dist` ou `build`

Configure em `vercel.json`:
```json
{
  "projects": [
    {
      "name": "mycolection-frontend",
      "rootDirectory": "frontend",
      "buildCommand": "npm run build",
      "outputDirectory": "dist"
    }
  ]
}
```

---

## 🔍 Troubleshooting

| Erro | Solução |
|------|---------|
| `Cannot GET /bff/itens` | BFF não está rodando ou URL está errada |
| `CORS error` | Adicione origem no `CorsConfig.java` do BFF |
| `404 Not Found` | Verifique se endpoint existe no BFF |
| `Connection refused` | Backend ou BFF não estão rodando |

---

## 📚 Referências

- Angular Environments: https://angular.io/guide/build#configuring-application-environments
- Environment Variables Vercel: https://vercel.com/docs/projects/environment-variables

---

**Status**: Frontend pronto para usar BFF ✅  
**Próximo passo**: Deploy em Vercel! 🚀

