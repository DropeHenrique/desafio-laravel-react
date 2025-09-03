# 🎵 Top 5 - Tião Carreiro e Pardinho

Uma aplicação moderna que exibe as 5 músicas mais tocadas da dupla Tião Carreiro e Pardinho, com funcionalidades de sugestão de novas músicas, autenticação e administração.

## 🚀 Tecnologias Utilizadas

### Backend
- **Laravel v11** - Framework PHP
- **Laravel Sanctum** - Autenticação API
- **MySQL 8.0** - Banco de dados
- **Redis** - Cache e sessões
- **PHP 8.2** - Linguagem de programação

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado
- **React Toastify** - Notificações

### DevOps
- **Docker & Docker Compose** - Containerização
- **Nginx** - Servidor web
- **Portas customizadas** - Evita conflitos com outros projetos

## 📋 Funcionalidades

### ✅ Implementadas
- [x] **Separação Backend/Frontend** - API REST para comunicação
- [x] **Backend Laravel v11** - API completa com autenticação
- [x] **Frontend React SPA** - Interface moderna e responsiva
- [x] **Autenticação** - Login, registro e proteção de rotas
- [x] **CRUD de Músicas** - Criar, editar, excluir e aprovar músicas
- [x] **Paginação** - Músicas a partir da 6ª posição com paginação
- [x] **Sistema de Aprovação** - Apenas usuários autenticados podem aprovar/reprovar
- [x] **Layout Moderno** - Interface com Material-UI
- [x] **Docker** - Ambiente containerizado com portas customizadas
- [x] **Testes Automatizados** - Testes para backend e frontend
- [x] **Validação em Português** - Mensagens de erro em português brasileiro
- [x] **Toasts** - Notificações visuais para feedback do usuário

### 🎯 Funcionalidades Principais

1. **Visualização das Músicas**
   - Top 5 músicas em destaque
   - Músicas adicionais com paginação
   - Visualizações e estatísticas

2. **Sistema de Sugestões**
   - Usuários podem sugerir novas músicas
   - Links do YouTube são validados
   - Sistema de aprovação para moderadores

3. **Autenticação e Autorização**
   - Registro e login de usuários
   - Tokens JWT para autenticação
   - Rotas protegidas para administração

4. **Painel Administrativo**
   - Aprovação/reprovação de sugestões
   - Edição e exclusão de músicas
   - Gerenciamento completo do conteúdo

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Docker e Docker Compose
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/DropeHenrique/desafio-laravel-react.git
cd desafio-laravel-react
```

### 2. Inicie o ambiente Docker
```bash
# Execute o script de inicialização (RECOMENDADO)
./docker/start.sh

# Ou manualmente:
cd docker
docker-compose up --build -d
```

### 3. Acesse a aplicação
- **Frontend React**: http://localhost:3001
- **Backend Laravel API**: http://localhost:8001
- **MySQL**: localhost:3307
- **Redis**: localhost:6380

## 🔧 Configuração Manual (Desenvolvimento)

### Backend (Laravel)
```bash
cd backend

# Instalar dependências
composer install

# Gerar chave da aplicação
php artisan key:generate

# Executar migrations
php artisan migrate

# Popular banco com dados de exemplo
php artisan db:seed --class=SongSeeder

# Iniciar servidor
php artisan serve --port=8001
```

### Frontend (React)
```bash
cd frontend

# Instalar dependências
npm install --legacy-peer-deps

# Iniciar servidor de desenvolvimento
npm start
```

## 🧪 Executando Testes

### Backend (Laravel)
```bash
# Via Docker (recomendado)
cd docker && docker exec top5_php php artisan test

# Ou manualmente
cd backend && php artisan test
```

**Resultado esperado:**
```
✅ Tests: 8 passed (18 assertions)
✅ Duration: ~0.4s
```

### Frontend (React)
```bash
# Via Docker (recomendado)
cd docker && docker exec top5_node npm test -- --watchAll=false

# Ou manualmente
cd frontend && npm test
```

**Resultado esperado:**
```
✅ Test Suites: 1 passed, 1 total
✅ Tests: 6 passed, 6 total
✅ Duration: ~6s
```

## 📊 Estrutura do Projeto

```
desafio-laravel-react/
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── tests/
│   ├── .env.example         # Configurações de exemplo
│   └── .env                 # Configurações do ambiente
├── frontend/                # SPA React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── contexts/
│   ├── .env                 # Configurações do frontend
│   └── package.json
├── docker/                  # Configuração Docker
│   ├── nginx/
│   ├── php/
│   ├── node/
│   ├── start.sh            # Script de inicialização
│   └── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/register` - Registrar usuário
- `POST /api/login` - Login
- `POST /api/logout` - Logout (autenticado)
- `GET /api/me` - Dados do usuário (autenticado)

### Músicas
- `GET /api/songs` - Listar todas as músicas
- `GET /api/songs/{id}` - Detalhes de uma música
- `POST /api/songs` - Sugerir nova música
- `PUT /api/songs/{id}` - Editar música (autenticado)
- `DELETE /api/songs/{id}` - Excluir música (autenticado)
- `POST /api/songs/{id}/approve` - Aprovar música (autenticado)
- `POST /api/songs/{id}/reject` - Reprovar música (autenticado)
- `GET /api/songs/pending` - Músicas pendentes (autenticado)

## 🐳 Docker

### Portas Utilizadas
- **8001** - Laravel API (Nginx)
- **3001** - React App
- **3307** - MySQL
- **6380** - Redis

### Comandos Úteis
```bash
# Iniciar containers
./docker/start.sh

# Parar containers
cd docker && docker-compose down

# Ver logs
cd docker && docker-compose logs -f

# Reconstruir containers
cd docker && docker-compose up --build -d

# Executar comandos no container
docker exec top5_php php artisan migrate
docker exec top5_node npm install
```

## 🎨 Interface

A aplicação utiliza Material-UI para uma interface moderna e responsiva:

- **Design System** consistente
- **Componentes reutilizáveis**
- **Responsividade** para mobile e desktop
- **Tema personalizado** com cores da marca
- **Navegação intuitiva**
- **Toasts** para feedback visual

## 🔒 Segurança

- **Autenticação JWT** com Laravel Sanctum
- **Validação de dados** no backend
- **Proteção CSRF** para rotas web
- **Sanitização de inputs**
- **Rate limiting** (configurável)

## 📈 Performance

- **Paginação** para grandes volumes de dados
- **Cache Redis** para sessões
- **Otimização de imagens** (thumbnails do YouTube)
- **Lazy loading** de componentes
- **Compressão gzip** no Nginx

## 🚀 Deploy

### Produção
1. Configure variáveis de ambiente
2. Execute migrations
3. Configure SSL/HTTPS
4. Configure cache e otimizações
5. Configure monitoramento

### Variáveis de Ambiente Importantes
```env
# Backend
DB_HOST=mysql
DB_DATABASE=top5_tiao_carreiro
REDIS_HOST=redis

# Frontend
REACT_APP_API_URL=http://localhost:8001/api
```

## 👤 Usuário de Teste

Após executar o script de inicialização, você pode:

1. **Criar uma conta** através da interface de registro
2. **Usar dados de exemplo** (se configurado no seeder)

## 🎯 Funcionalidades Disponíveis

1. **Visualizar músicas** - Top 5 + paginação
2. **Sugerir música** - Formulário público
3. **Login/Registro** - Autenticação com toasts
4. **Administração** - Aprovar/reprovar músicas
5. **CRUD completo** - Editar/excluir músicas


## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Pedro Crispim** - Implementação completa do desafio técnico

## 📞 Dúvidas

Para suporte, entre em contato através de:
- Email: pedrohenriquecrispim@hotmail.com

---

**Desenvolvido com ❤️ para o desafio técnico Laravel/React**