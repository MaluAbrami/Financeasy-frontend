# Financeasy - Frontend

Um aplicativo moderno de gestão financeira pessoal construído com React, TypeScript e Vite. Financeasy permite que você organize suas contas bancárias, cartões de crédito, transações e mantenha lembretes de pendências recorrentes.

## 🎯 Funcionalidades Principais

### 📊 Dashboard
- Visualização consolidada de seus dados financeiros
- Gráfico de despesas vs. receitas mensais
- Controle de gastos mensais
- Resumo rápido de contas bancárias

### 🏦 Contas Bancárias
- Criar e gerenciar múltiplas contas bancárias
- Visualizar saldo e limite de crédito
- Paginação de contas
- Atualização de saldos

### 💳 Cartões de Crédito
- Gerenciar cartões de crédito vinculados às contas bancárias
- Visualizar limite disponível e utilizado
- Acompanhar compras realizadas com cartão
- Visualizar faturas emitidas
- Criar novas compras parceladas

### 💰 Transações
- Registrar transações de entrada e saída
- Categorizar transações
- Filtrar por período
- Visualizar histórico detalhado

### 📝 Lembretes - Pendências Pessoais e Recorrentes
Sistema inteligente de lembretes para ajudá-lo a manter organização de contas, assinaturas e despesas recorrentes:

#### Status dos Alertas (Sistema de Cores)
- **🟢 Verde**: Falta **mais de 5 dias** para o vencimento (ainda está distante)
- **🟡 Amarelo**: Falta **3 a 5 dias** para o vencimento (próximo ao vencimento - momento de se alertar)
- **🔴 Vermelho**: Falta **2 dias ou menos** para o vencimento, ou já venceu (exatamente na data ou atrasado)

#### Funcionalidades
- Criar lembretes com categoria, valor e data de vencimento
- Definir recorrência (Mensal, Trimestral, Semestral, Anual ou Nenhuma)
- Marcar lembretes como pagos com um clique (botão ✓)
- Deletar lembretes quando não forem mais necessários
- Filtrar por mês e ano
- Paginação automática para melhor organização

### 🔐 Autenticação
- Login e registro de usuários
- Validação de credenciais
- Persistência de sessão via storage
- Recuperação de senha

### 🎨 Temas
- Suporte para temas claro e escuro
- Preferência automática baseada no sistema
- Mudança de tema em tempo real

## 🚀 Começando

### Requisitos
- Node.js >= 16
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd financeasy-project
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (se necessário)
   Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias para conectar ao backend.

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:5173`

## 📦 Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Verifica erros de linting
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── assets/              # Imagens e arquivos estáticos
├── components/          # Componentes React reutilizáveis
│   ├── cards/          # Componentes de cartões (Purchases, Invoices, Summary)
│   ├── dashboard/      # Componentes do dashboard (Alerts, Charts, Accounts)
│   ├── layout/         # Componentes de layout (Header, NavBar, Footer)
│   └── ui/             # Componentes de UI base (Button, Input, Select, etc)
├── contexts/           # React Contexts (Autenticação, Temas)
├── hooks/              # Hooks customizados (useDashboardData)
├── lib/                # Utilitários e helpers
├── models/             # Tipos TypeScript e interfaces
│   ├── alert/          # Modelos de alertas
│   ├── bankAccount/    # Modelos de contas bancárias
│   ├── card/           # Modelos de cartões
│   ├── category/       # Modelos de categorias
│   ├── transaction/    # Modelos de transações
│   ├── pagination/     # Modelos de paginação
│   └── dashboards/     # Modelos de dados do dashboard
├── pages/              # Páginas da aplicação
│   ├── auth/           # Páginas de autenticação (Login, Register)
│   ├── Dashboard.tsx
│   ├── Cards.tsx
│   └── Home.tsx
├── routes/             # Configuração de rotas
├── services/           # Serviços de API
│   ├── AlertService.tsx
│   ├── CardService.tsx
│   ├── CardPurchaseService.tsx
│   ├── CardInvoiceService.tsx
│   ├── TransactionService.tsx
│   ├── BankAccountService.tsx
│   ├── CategoryService.tsx
│   ├── DashboardService.tsx
│   └── ApiClient.ts
├── storage/            # Gerenciamento de storage local
├── styles/             # Estilos globais
├── util/               # Funções utilitárias
├── validators/         # Validadores (ex: schemas de autenticação)
├── App.tsx
└── main.tsx
```

## 🛠 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Estilização
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### Utilitários
- **date-fns** - Manipulação de datas
- **clsx** - Conditional classnames
- **tailwind-merge** - Merge de classes Tailwind

## 🔄 Fluxo de Dados

1. **Autenticação**: O usuário faz login e a sessão é armazenada localmente
2. **Dashboard**: Carrega dados consolidados via `useDashboardData` hook
3. **Serviços**: Cada entidade tem um serviço (CardService, AlertService, etc) que se comunica com a API
4. **Componentes**: Recebem dados via props e chamadas aos serviços
5. **Storage**: Dados sensíveis são persistidos no localStorage

## 📝 Principais Componentes

### AlertsCard
Gerencia lembretes de pendências pessoais com:
- Criação de novos lembretes
- Status visual baseado em dias para vencimento (Verde, Amarelo, Vermelho)
- Botão para marcar como pago (✓)
- Deleção de lembretes
- Paginação

### CardPurchases
Exibe compras do cartão com:
- Data, descrição e valor
- Número de parcelas
- Deleção de compras
- Popover de confirmação para deleção

### ExpenseIncomeChart
Visualiza dados de despesas vs receitas em gráfico

### AccountCard
Resumo de contas bancárias com:
- Saldo e limite
- Barra de proporção de uso
- Gerenciamento de contas

## 🔒 Segurança

- Senhas são validadas no backend
- Tokens são armazenados seguramente via storage
- Rotas privadas protegem acesso não autorizado
- Validação de entrada via Zod

## 🚧 Status do Projeto

Este é um projeto em desenvolvimento ativo. Novas funcionalidades e melhorias são adicionadas regularmente.

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para simplificar sua vida financeira**
