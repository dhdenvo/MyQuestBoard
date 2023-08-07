const { GLOBAL_CONNECTIONS } = require("./config.json");

const globalConnectionsList = Object.fromEntries(
  Object.values(GLOBAL_CONNECTIONS).map((conn) => [conn, null])
);

const getFuncs = Object.fromEntries(
  Object.values(GLOBAL_CONNECTIONS).map((conn) => [
    `${conn}Conn`,
    () => globalConnectionsList[conn],
  ])
);

const setFuncs = Object.fromEntries(
  Object.values(GLOBAL_CONNECTIONS).map((conn) => [
    `${conn}SetConn`,
    (connection) => {
      globalConnectionsList[conn] = connection;
    },
  ])
);

module.exports = { ...getFuncs, ...setFuncs };
