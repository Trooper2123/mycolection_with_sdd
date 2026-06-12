# 📖 Índice de Documentação - MyCollection

Bem-vindo! Este é o guia central para navegar a documentação do projeto MyCollection com arquitetura BFF.

---

## 🎯 Comece Aqui

### ⚡ Tenho 5 minutos?
→ **[QUICK_START.md](QUICK_START.md)** - Inicie rápido com 3 comandos

### 📚 Quero entender o projeto?
→ **[README.md](README.md)** - Visão geral completa com instruções

### 🏗️ Quero entender a arquitetura?
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detalhes da arquitetura BFF

---

## 📋 Documentação Completa

### Para Desenvolvedores

| Documento | Conteúdo |
|-----------|----------|
| [QUICK_START.md](QUICK_START.md) | Como iniciar rapidamente |
| [README.md](README.md) | Visão geral e instruções de execução |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Explicação completa da arquitetura BFF |
| [FRONTEND_CONFIG.md](FRONTEND_CONFIG.md) | Como configurar o frontend Angular |
| [SIMPLIFICATION_GUIDE.md](SIMPLIFICATION_GUIDE.md) | Mudanças realizadas na simplificação |

### Para DevOps / Infraestrutura

| Documento | Conteúdo |
|-----------|----------|
| [DEPLOY.md](DEPLOY.md) | Guia passo-a-passo para deploy em Vercel + Railway |
| [docker-compose.yml](docker-compose.yml) | Compose para rodar tudo localmente |
| [vercel.json](vercel.json) | Configuração do Vercel |
| [.env.example](.env.example) | Template de variáveis de ambiente |

### Arquivos de Configuração

| Arquivo | Propósito |
|---------|----------|
| `package.json` | Scripts npm para build/test |
| `settings.gradle` | Configuração dos módulos Gradle |
| `bff/Dockerfile` | Imagem Docker do BFF |

---

## 🗂️ Estrutura do Projeto

```
mycolection_with_sdd/
│
├── 📄 Documentação (este projeto)
│   ├── README.md                    ← COMECE AQUI
│   ├── QUICK_START.md               ← Inicie rapidinho
│   ├── ARCHITECTURE.md              ← Entenda a arquitetura
│   ├── DEPLOY.md                    ← Deploy para produção
│   ├── FRONTEND_CONFIG.md           ← Configurar frontend
│   ├── SIMPLIFICATION_GUIDE.md      ← O que foi simplificado
│   └── INDEX.md                     ← Este arquivo!
│
├── 🔧 Configurações
│   ├── package.json                 ← Scripts npm
│   ├── vercel.json                  ← Config Vercel
│   ├── docker-compose.yml           ← Docker local
│   ├── .env.example                 ← Template env
│   └── settings.gradle              ← Config Gradle
│
├── 🖥️ Backend (Java Spring Boot)
│   ├── src/main/java/br/com/acervo  ← Código-fonte
│   ├── src/main/resources           ← application.properties
│   ├── src/test                     ← Testes
│   └── build.gradle                 ← Build config
│
├── 🌉 BFF (Java Spring Boot + WebFlux)
│   ├── src/main/java/br/com/acervo/bff
│   │   ├── controller/              ← REST endpoints
│   │   ├── service/                 ← Lógica BFF
│   │   ├── dto/                     ← Data transfer objects
│   │   ├── client/                  ← HTTP client (backend)
│   │   └── config/                  ← Configurações (CORS, WebClient)
│   ├── Dockerfile                   ← Build container
│   └── build.gradle                 ← Build config
│
└── 🎨 Frontend (Angular 18)
    ├── src/
    │   ├── app/
    │   │   ├── components/          ← Componentes Angular
    │   │   ├── models/              ← Interfaces model
    │   │   └── services/            ← Serviços HTTP
    │   ├── index.html               ← HTML raiz
    │   └── main.ts                  ← Entrada da app
    ├── package.json                 ← Dependências npm
    └── angular.json                 ← Config Angular
```

---

## 🎯 Casos de Uso

### Eu quero...

**...rodar o projeto localmente**
1. Leia: [QUICK_START.md](QUICK_START.md)
2. Execute os 3 terminais
3. Acesse http://localhost:4200

**...entender como funciona**
1. Leia: [README.md](README.md)
2. Estude: [ARCHITECTURE.md](ARCHITECTURE.md)
3. Explore o código no IDE

**...fazer deploy em Vercel**
1. Siga: [DEPLOY.md](DEPLOY.md)
2. Configure: [FRONTEND_CONFIG.md](FRONTEND_CONFIG.md)
3. Deploy no Vercel

**...modificar o frontend**
1. Estude: [FRONTEND_CONFIG.md](FRONTEND_CONFIG.md)
2. Código em: `frontend/src/app/`
3. Teste localmente

**...adicionar novos endpoints**
1. Consulte: [ARCHITECTURE.md](ARCHITECTURE.md)
2. Modifique backend: `backend/src/main/java/`
3. Adicione ao BFF: `bff/src/main/java/br/com/acervo/bff/`

**...entender as mudanças feitas**
1. Leia: [SIMPLIFICATION_GUIDE.md](SIMPLIFICATION_GUIDE.md)
2. Compare com versão anterior

---

## 🔄 Fluxo de Desenvolvimento

```
┌─────────────────────────────────┐
│   1. Desenvolver localmente     │ ← [QUICK_START.md]
│   (3 terminais/Docker)          │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│   2. Testar funcionalidades     │
│   (APIs, UI, Integração)        │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│   3. Commitar e Push no Git     │
│   (GitHub)                      │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│   4. Deploy em Produção         │ ← [DEPLOY.md]
│   (Vercel + Railway)            │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│   5. Monitorar em Produção      │
│   (Logs, Alertas)               │
└─────────────────────────────────┘
```

---

## 🏗️ Stack Technologies

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 18, TypeScript, npm |
| BFF | Spring Boot 3.2, WebFlux, Java 21 |
| Backend | Spring Boot 3.2, JPA, Java 21 |
| Database | H2 (dev), PostgreSQL (prod) |
| Build | Gradle 8 |
| Deployment | Vercel, Railway, Docker |
| Documentação | Markdown |

---

## 🎓 Nível de Conhecimento Requerido

| Função | Conhecimentos |
|--------|-----------|
| Frontend Dev | HTML, CSS, TypeScript, Angular |
| Backend Dev | Java, Spring Boot, REST API |
| DevOps | Docker, CI/CD, Cloud providers |
| Full Stack | Tudo acima |

---

## ❓ FAQ Rápido

**P: Qual é o objetivo do BFF?**  
R: Fazer proxy e orquestração de requisições entre frontend e backend, centralizando CORS e enriquecendo dados.

**P: Preciso de Docker?**  
R: Não! Use 3 terminais. Docker é opcional para praticidade.

**P: Como vai ser o deploy?**  
R: Frontend + BFF no Vercel, Backend em Railway/Render.

**P: Qual banco usar em produção?**  
R: PostgreSQL (H2 é apenas para desenvolvimento).

**P: Posso mudar a porta?**  
R: Sim! Configure em `application.properties` de cada serviço.

---

## 📞 Suporte

### Problemas comuns?
→ Veja "Troubleshooting" em [QUICK_START.md](QUICK_START.md)

### Dúvidas técnicas?
→ Consulte [ARCHITECTURE.md](ARCHITECTURE.md)

### Quer fazer deploy?
→ Siga passo-a-passo em [DEPLOY.md](DEPLOY.md)

### Precisa configurar frontend?
→ Leia [FRONTEND_CONFIG.md](FRONTEND_CONFIG.md)

---

## 🚀 Roadmap

- [x] Arquitetura BFF implementada
- [x] Documentação completa
- [x] Docker Compose
- [x] Vercel config
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Testes automatizados (aumentar cobertura)
- [ ] Monitoramento em produção
- [ ] API versioning (v1, v2, etc)
- [ ] Rate limiting no BFF
- [ ] Cache estratégico

---

## 📄 Licença & Créditos

Projeto desenvolvido com foco em arquitetura limpa e escalabilidade.

---

## 🎉 Pronto para Começar?

1. **Iniciante**: [QUICK_START.md](QUICK_START.md)
2. **Intermediário**: [README.md](README.md) → [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Avançado**: [DEPLOY.md](DEPLOY.md) → Customize conforme necessário

**Boa sorte! 🍀**

---

**Última atualização**: Junho 2026  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para Produção

