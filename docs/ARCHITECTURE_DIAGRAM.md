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
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

... (conteúdo completo copiado para docs)
