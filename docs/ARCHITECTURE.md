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

... (conteúdo completo copiado para docs)
