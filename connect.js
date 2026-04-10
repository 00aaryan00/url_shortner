const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

let connectionPromise = null;

async function connectToMongoDB(url) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(url, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = {
  connectToMongoDB,
};
