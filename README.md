# Sistema de Gestão de Fichas de Emergência

Um sistema completo de gestão de fichas de emergência construído com Next.js 16, Auth.js e Neon PostgreSQL.

## Características

- **Autenticação Segura**: Sistema de login/signup com Auth.js e senhas criptografadas com bcrypt
- **Banco de Dados**: PostgreSQL via Neon com schema otimizado
- **Dashboard**: Painel executivo com estatísticas e gráficos interativos
- **Gestão de Fichas**: Criação, edição e exclusão de fichas de emergência
- **Relatórios**: Análise de dados com múltiplos tipos de relatórios
- **Exports**: Exportar dados em formato CSV
- **Interface Responsiva**: Design moderno com shadcn/ui e Tailwind CSS

## Requisitos

- Node.js 18+
- npm ou pnpm
- Neon PostgreSQL Database
- Environment variables configuradas

## Instalação

1. **Clone o repositório**
```bash
git clone <repo-url>
cd seu-projeto
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# NextAuth
NEXTAUTH_SECRET=seu-secret-aleatorio-aqui
NEXTAUTH_URL=http://localhost:3000
```

Para gerar um NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

4. **Inicialize o banco de dados**

O banco de dados foi criado automaticamente via script durante a setup. Se precisar reinicializar:

```bash
npm run seed:db
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
app/
├── api/
│   ├── auth/              # Rotas de autenticação
│   ├── forms/             # API CRUD de fichas
│   └── reports/           # API de relatórios
├── auth/
│   ├── signin/            # Página de login
│   └── signup/            # Página de registro
├── dashboard/             # Dashboard principal
├── forms/
│   ├── new/               # Criar nova ficha
│   └── [id]/              # Visualizar ficha
├── reports/               # Página de relatórios
└── settings/              # Página de configurações

components/
├── ui/                    # Componentes shadcn/ui
└── dashboard/             # Componentes do dashboard

lib/
├── auth.ts                # Configuração de Auth.js
├── db.ts                  # Helper de banco de dados
├── api.ts                 # Cliente API
└── utils.ts               # Utilitários

middleware.ts             # Middleware de autenticação
```

## Fluxo de Autenticação

1. Usuário acessa `/` que redireciona para `/auth/signin`
2. Login com credenciais (usuário/senha)
3. Auth.js cria uma sessão JWT
4. Middleware protege rotas autenticadas
5. Redirecionamento automático para dashboard após login

## Banco de Dados

### Schema

**users** - Tabela de usuários
- id (UUID)
- email (unique)
- name
- password_hash
- role
- created_at

**emergency_forms** - Fichas de emergência
- id (UUID)
- user_id (FK)
- title
- blood_type
- allergies
- medications
- emergency_contacts (JSON)
- documents (JSON - base64)
- status
- created_at
- updated_at

**form_submissions** - Histórico de submissões
- id (UUID)
- form_id (FK)
- submitted_at

**analytics_logs** - Logs de atividade
- id (UUID)
- user_id (FK)
- action
- created_at

## API Endpoints

### Autenticação
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/signup` - Criar nova conta

### Formulários
- `GET /api/forms` - Listar fichas
- `POST /api/forms` - Criar ficha
- `GET /api/forms/[id]` - Obter ficha
- `PUT /api/forms/[id]` - Atualizar ficha
- `DELETE /api/forms/[id]` - Deletar ficha

### Relatórios
- `GET /api/reports` - Obter relatórios (tipos: summary, blood-types, allergies, timeline)

## Desenvolvimento

### Adicionar nova página
1. Crie a pasta em `app/`
2. Adicione `page.tsx`
3. Use o middleware de autenticação para proteger

### Adicionar novo endpoint
1. Crie em `app/api/`
2. Use `getSession()` para verificar autenticação
3. Use helpers de `lib/db.ts` para queries

### Estilizar componentes
- Use Tailwind CSS
- Componentes shadcn/ui disponíveis
- Variáveis CSS em `app/globals.css`

## Segurança

- Senhas com bcryptjs (10 rounds)
- Sessions JWT com NextAuth
- Middleware valida autenticação
- Queries parametrizadas contra SQL injection
- CSRF protection via NextAuth

## Próximos Passos

- [ ] Edição de fichas existentes
- [ ] Upload de documentos com compressão
- [ ] Notificações por email
- [ ] Sistema de permissões (compartilhar fichas)
- [ ] Autenticação com OAuth
- [ ] App mobile
- [ ] Backup automático

## Troubleshooting

### Erro de conexão com banco de dados
- Verifique DATABASE_URL em `.env.local`
- Confirme que o Neon está ativo
- Teste a conexão: `psql $DATABASE_URL`

### Erro de autenticação
- Limpe cookies do navegador
- Verifique NEXTAUTH_SECRET
- Confirme que DATABASE_URL aponta para o banco correto

### Compilação falha
- Delete `.next` e `node_modules`
- Rode `pnpm install && pnpm build`

## Licença

MIT
