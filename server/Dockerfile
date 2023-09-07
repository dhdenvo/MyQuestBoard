FROM node:20

# At the moment doesn't affect anything
ENV NODE_ENV=production

WORKDIR /server-app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "app.js"]
