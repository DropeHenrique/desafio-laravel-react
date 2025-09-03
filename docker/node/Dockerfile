FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências e construir (será executado quando o volume for montado)
# RUN npm ci --only=production
# RUN npm run build

# Instalar servidor para servir arquivos estáticos
RUN npm install -g serve

# Expor porta
EXPOSE 3000

# Comando para servir a aplicação
CMD ["serve", "-s", "build", "-l", "3000"]
