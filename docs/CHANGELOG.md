# CHANGELOG — MyColection

Histórico de versões, plano de implementação e roadmap de melhorias futuras do projeto **MyColection**.

---

## [1.0.0] — 2026-08-06 🚀 Migração de Arquitetura

### Contexto
O projeto foi originalmente desenvolvido com uma arquitetura distribuída de três camadas:
- **Backend**: API REST em Java + Spring Boot (Gradle)
- **BFF** *(Backend for Frontend)*: Camada intermediária em Java + Spring Reactive (Gradle)
- **Frontend**: SPA em Angular (TypeScript)

A versão `1.0.0` representa a migração completa dessa stack para uma arquitetura **serverless** moderna, eliminando a necessidade de servidores gerenciados e simplificando o ciclo de deploy.

---

### Stack Implementada

| Camada         | Antes                       | Depois                          |
|----------------|-----------------------------|---------------------------------|
| Frontend       | Angular (TypeScript)        | **React 18 + Vite + TypeScript** |
| Estilização    | CSS puro                    | **Tailwind CSS v3**             |
| Banco de Dados | PostgreSQL (via Spring Data) | **Firebase Firestore (NoSQL)**  |
| Autenticação   | Sem autenticação            | **Firebase Authentication**     |
| Hospedagem     | Vercel                      | **Firebase Hosting**            |
| Backend        | Spring Boot REST API         | *(eliminado — lógica no client)* |
| BFF            | Spring WebFlux               | *(eliminado — lógica no client)* |

---

### O que foi implementado

#### 🧹 Limpeza e Reestruturação
- Remoção completa das pastas `backend/`, `bff/` e `frontend/`
- Remoção de arquivos de build Gradle (`build.gradle`, `settings.gradle`, `gradlew`, `gradlew.bat`)
- Remoção de `docker-compose.yml` e `vercel.json`
- Nova estrutura do projeto React posicionada diretamente na raiz do repositório

#### ⚙️ Configuração do Ambiente
- `package.json` com dependências: `react`, `react-dom`, `firebase`, `lucide-react`, `tailwindcss`, `vite`, `typescript`
- `vite.config.ts` com plugin React
- `tsconfig.json` e `tsconfig.node.json` para compilação TypeScript
- `src/vite-env.d.ts` para suporte a `import.meta.env` no TypeScript
- `tailwind.config.js` + `postcss.config.js` para estilização com Tailwind CSS

#### 🔥 Firebase
- `firebase.json` com Hosting (rewrite SPA) e referência ao Firestore
- `firestore.rules` com regras de segurança baseadas em proprietário e colaboradores
- `firestore.indexes.json` com estrutura base (índices simples gerenciados automaticamente pelo Firestore)
- `.env.example` documentando todas as variáveis de ambiente necessárias

#### 🖥️ Aplicação React

**`src/types.ts`**
- Interface `Item` (nome, tipoMidia, categorias, console, descricao, tags, datas de empréstimo, perdido, ownerId, ownerEmail)
- Interface `Share` (ownerId, ownerEmail, collaboratorEmail, role: editor | viewer)
- Funções auxiliares `getStatusEmprestimo` e `getLabelTipoMidia` (lógica portada do BFF Java)

**`src/firebase.ts`**
- Inicialização condicional do Firebase (valida presença de variáveis de ambiente)
- Exportação de `auth`, `db` e flag `isFirebaseConfigured`

**`src/App.tsx`**
- Gerenciamento do estado de autenticação via `onAuthStateChanged`
- Tela de guia de setup exibida quando o `.env` não está configurado
- Roteamento entre `<Auth />` e `<Collection />`

**`src/components/Auth.tsx`**
- Login e cadastro com Firebase Auth (e-mail + senha)
- Mensagens de erro em português mapeadas por `err.code`
- Design premium com glassmorphism, animações e suporte mobile-first

**`src/components/Collection.tsx`**
- Sincronização em tempo real com Firestore via `onSnapshot`
- Seletor de espaço de trabalho (Meu Acervo / Acervos Compartilhados)
- Filtros client-side por tipo de mídia e categoria (busca textual)
- Paginação local com 8 itens por página
- Formulário completo de criação/edição com validações de negócio:
  - Campo `console` obrigatório para tipo `JOGO`
  - Campos `nome` e `categorias` sempre obrigatórios
- Empréstimo (com data de devolução calculada para +1 mês) e devolução de itens
- Exclusão direta (itens disponíveis) ou marcação como "Perdido" com justificativa (itens emprestados)
- Painel de compartilhamento: convidar colaboradores por e-mail com papel de Leitor ou Editor
- Revogação de acesso de colaboradores existentes

#### 🔒 Segurança (Firestore Rules)
- Usuário autenticado pode ler/criar/editar/excluir apenas seus próprios documentos em `items`
- Leitura de itens de terceiros exige documento correspondente na coleção `shares`
- Escrita em itens de terceiros exige `role == 'editor'` no documento de `shares`
- Gerenciamento de `shares` restrito exclusivamente ao proprietário do acervo

---

### Deploy
- **Build**: `npm run build` → geração dos bundles em `dist/`
- **Hospedagem**: `firebase deploy` → publicado em https://biblioteca-do-caos.web.app
- **Console do projeto**: https://console.firebase.google.com/project/biblioteca-do-caos/overview

---

## Roadmap — Melhorias Futuras

### 🔐 Segurança e Autenticação
- [ ] **Login Social**: Adicionar provedores OAuth (Google, GitHub) via Firebase Authentication
- [ ] **Recuperação de Senha**: Implementar fluxo de redefinição de senha por e-mail (`sendPasswordResetEmail`)
- [ ] **Verificação de E-mail**: Enviar e-mail de confirmação ao criar conta (`sendEmailVerification`)
- [ ] **Regras Firestore com `get()` otimizado**: Reavaliar a query de `getShare` nas rules para minimizar leituras extras em chamadas de escrita

### 📦 Funcionalidades do Acervo
- [ ] **Upload de Capa**: Integrar Firebase Storage para upload de imagens de capa dos itens
- [ ] **Histórico de Empréstimos**: Registrar um subcoleção `historico` por item com o log de todas as retiradas e devoluções
- [ ] **Notificações de Devolução**: Enviar e-mail de lembrete via Firebase Extensions (por ex. Trigger Email) quando a data de devolução estiver próxima
- [ ] **Busca Textual Avançada**: Integrar Algolia ou Typesense para busca full-text sobre `nome`, `descricao` e `tags`
- [ ] **Ordenação Configurável**: Permitir que o usuário ordene a lista por nome, data de cadastro ou status de empréstimo
- [ ] **Importação em Lote**: Importar acervo via upload de arquivo CSV ou JSON
- [ ] **Exportação do Acervo**: Exportar todos os itens para CSV ou PDF imprimível

### 🎨 Interface e UX
- [ ] **Modo Kanban / Cards**: Vista alternativa em cards com capa dos itens, além da lista atual
- [ ] **Dark/Light Mode Toggle**: Adicionar alternância de tema com persistência no `localStorage`
- [ ] **Animações de Transição**: Adicionar transições de página/modal com Framer Motion
- [ ] **Notificações Toast**: Substituir as mensagens de feedback inline por notificações flutuantes (ex: `react-hot-toast`)
- [ ] **Internacionalização (i18n)**: Suportar múltiplos idiomas via `react-i18next`
- [ ] **PWA (Progressive Web App)**: Adicionar manifest e service worker para instalação e uso offline via Vite PWA Plugin

### 🏗️ Arquitetura e Qualidade
- [ ] **Code Splitting (Lazy Loading)**: Dividir o bundle principal (atualmente ~630 KB) com `React.lazy` e `Suspense` para reduzir o tempo de carregamento inicial
- [ ] **Testes Unitários**: Adicionar testes com Vitest e React Testing Library para os componentes principais
- [ ] **Testes de Regras Firestore**: Usar `@firebase/rules-unit-testing` para testar as regras de segurança em CI/CD
- [ ] **CI/CD com GitHub Actions**: Automatizar build, lint e `firebase deploy` a cada push na branch `main`
- [ ] **React Router DOM**: Adicionar roteamento de URLs para suportar deep links (ex: `/acervo/item/:id`)
- [ ] **Zustand ou Context API**: Centralizar o estado global (usuário, espaço ativo, itens) para evitar prop drilling em componentes mais profundos

---

*Gerado em: 2026-08-06 | Projeto: MyColection | Repositório: mycolection_with_sdd*
