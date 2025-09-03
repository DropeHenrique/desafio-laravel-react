#!/bin/bash

echo "🚀 Iniciando o projeto Top 5 - Tião Carreiro e Pardinho..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Obter o diretório do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Configurar arquivos de ambiente
echo "⚙️ Configurando arquivos de ambiente..."
if [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
    echo "   - Copiando backend/.env.example para backend/.env"
    cp "$PROJECT_ROOT/backend/.env.example" "$PROJECT_ROOT/backend/.env"
else
    echo "   - backend/.env já existe"
fi

if [ ! -f "$PROJECT_ROOT/frontend/.env" ]; then
    echo "   - Copiando frontend/.env.example para frontend/.env"
    cp "$PROJECT_ROOT/frontend/.env.example" "$PROJECT_ROOT/frontend/.env"
else
    echo "   - frontend/.env já existe"
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
cd "$SCRIPT_DIR" && docker-compose down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
cd "$SCRIPT_DIR" && docker-compose up --build -d

# Aguardar o MySQL estar pronto
echo "⏳ Aguardando MySQL estar pronto..."
sleep 30

# Executar migrations e seeders
echo "📊 Executando migrations e seeders..."
docker exec top5_php php artisan migrate:fresh --seed --force

# Popular com dados de exemplo
echo "🎵 Populando banco com músicas de exemplo..."
docker exec top5_php php artisan db:seed --class=SongSeeder --force

# Configurar frontend
echo "🎨 Configurando frontend..."
echo "   - Instalando dependências..."
docker exec top5_node npm install --legacy-peer-deps

echo "   - Fazendo build do frontend..."
docker exec top5_node npm run build

echo "✅ Projeto iniciado com sucesso!"
echo ""
echo "🌐 Acesse:"
echo "   - Frontend React: http://localhost:3001"
echo "   - Backend Laravel API: http://localhost:8001"
echo "   - MySQL: localhost:3307"
echo "   - Redis: localhost:6380"
echo ""
echo "📝 Para ver os logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"
