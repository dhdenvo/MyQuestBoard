const { connect } = require("mongoose");

const connectionString = `mongodb://${process.env.MONGO_URL}`;
connect(connectionString, { dbName: process.env.MONGO_DB_NAME })
  .then(() => console.log("Connected to the database"))
  .catch(() => {
    console.log("Unable to connect to the database");
    process.exit(1);
  });
