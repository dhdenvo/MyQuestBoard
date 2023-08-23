FROM node:20

WORKDIR /client-app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD react-scripts start
