FROM node:18-alpine

# Cria a pasta da api no container
RUN mkdir /api

# Definindo diretório de trabalho dentro do container
WORKDIR /api

# Copiando os arquivos para o container
COPY package*.json ./
# Definindo a porta em que o aplicativo será executado
# EXPOSE 3030

# Rodando o comando para instalar as dependências
RUN npm install

COPY . .

# Gera o Prisma Client
RUN npx prisma generate