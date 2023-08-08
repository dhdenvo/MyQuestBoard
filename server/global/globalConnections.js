const { GLOBAL_CONNECTIONS } = require("./config.json");

const globalConnectionsList = Object.fromEntries(
  Object.values(GLOBAL_CONNECTIONS).map((conn) => [conn, null])
);

module.exports = Object.fromEntries(
  Object.values(GLOBAL_CONNECTIONS)
    .map((conn) => {
      let resolveFunc;
      const prom = new Promise((resolve) => (resolveFunc = resolve));
      return [
        // Create the generic get function (use once you know the connection is made, like in a route)
        [`${conn}Conn`, () => globalConnectionsList[conn]],
        // Create a promise that gives the connection
        [`${conn}ConnProm`, prom],
        // Create a function for setting the connection
        [
          `${conn}SetConn`,
          (connection) => {
            resolveFunc(connection);
            globalConnectionsList[conn] = connection;
          },
        ],
      ];
    })
    .flat()
);
