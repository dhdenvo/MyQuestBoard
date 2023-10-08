FROM node:20 as client-builder

WORKDIR /client-app
COPY client/package.json .
RUN npm install
COPY client .
RUN npm run build

FROM node:20 as server

ENV TZ=America/Toronto
ENV NODE_ENV=production

WORKDIR /server-app
COPY server/package.json .
RUN npm install
COPY server .

COPY --from=client-builder /client-app/build ./build

EXPOSE 8080
CMD npm run server
