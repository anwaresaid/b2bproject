# Base image olarak Node.js kullanın
FROM node:18

# Çalışma dizinini /app olarak ayarlayın
WORKDIR /app

# Bağımlılıkları kopyalayın ve yükleyin
COPY package.json .
COPY package-lock.json .

# Node.js bağımlılıklarını yükleyin
RUN npm install

# Projeyi Docker içine kopyalayın
COPY . .

# Uygulamayı çalıştırmak için komut
#CMD ["npm", "run", "dev"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

EXPOSE 5173
