
# OrganizaLar

## Descrição

OrganizaLar é uma aplicação fullstack para gerenciamento de tarefas domésticas, cômodos, membros e planejamentos de limpeza.  
O usuário pode organizar os espaços da casa, criar tarefas para cada cômodo e montar planejamentos de limpeza eficientes, atribuindo membros para execução das tarefas.
Esse projeto foi criado exclusivamente para a disciplina de Software Product: Analysis, Specification, Project & Implementation da Faculdade Impacta.

---

## Tecnologias usadas

- Next.js (Front-end)  
- NestJS (Back-end)  
- TypeScript  
- TypeORM  
- PostgreSQL

---

## Como rodar o projeto

1. Clone o repositório e entre nas pastas `backend` e `frontend` para instalar as dependências:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Configure o banco de dados PostgreSQL:

- Instale o PostgreSQL localmente.  
- Crie um banco de dados chamado `organizalar` na porta padrão do PostgreSQL.

3. Configure as variáveis de ambiente para o backend:

- Na pasta `backend`, crie um arquivo `.env` baseado no `.env.example`.

4. Inicie o backend (NestJS):

```bash
cd backend
npm run start:dev
```

5. Inicie o frontend (Next.js):

```bash
cd frontend
npm run dev
```

Agora o projeto estará rodando localmente!

---

## Estrutura geral das pastas

```plaintext
/backend       # Código do backend NestJS, com API, entidades e lógica de negócio
/frontend      # Código do frontend Next.js, interface web do OrganizaLar
```

---

