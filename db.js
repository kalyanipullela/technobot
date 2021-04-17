const mongoose = require("mongoose");

let db;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// Initialize database connection
const init = async () => {
  console.log("URI", process.env.connectionURI);
  await mongoose.connect(process.env.connectionURI, options);
  db = mongoose.connection;
  return true;
};

// Return db connection
const get = () => {
  return db;
};

module.exports.init = init;
module.exports.get = get;
