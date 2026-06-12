# 🔄 Guia de Migração - Versão Anterior → Nova Versão com BFF

Se você era desenvolvedor neste projeto antes da simplificação, este guia explica o que mudou.

---

## 🎯 Objetivo da Mudança

Simplificar a arquitetura e preparar para deploy em Vercel usando padrão BFF.

---

## ❓ O QUE MUDOU?

### 1. Estrutura Gradle

**ANTES**:
```gradle
include 'backend'
include 'frontend'  ← ❌ Era módulo Gradle
include 'bff'
```

**DEPOIS**:
```gradle
include 'backend'
// frontend foi removido - agora é npm
include 'bff'
```

**Impacto**: 
- Frontend agora é projeto npm puro
- Build mais simples
- Não precisa mais executar Gradle para frontend

... (conteúdo completo copiado para docs)
