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

... (conteúdo completo copiado para docs)
