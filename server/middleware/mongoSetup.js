const { connect } = require("mongoose");

const connectionString = `mongodb://${process.env.MONGO_URL}?authSource=${process.env.MONGO_AUTH_SOURCE}`;
connect(connectionString)
  .then(() => console.log("Connected to the database"))
  .catch(() => {
    console.log("Unable to connect to the database");
    process.exit(1);
  });
