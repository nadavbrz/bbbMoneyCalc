
const mongoose = require("mongoose");
const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

    const connectionString =
    `mongodb+srv://${username}:${password}@cluster0.lrvpm.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=Cluster0`;
  const connectToMongo = () => {
    
    mongoose
      .connect(connectionString)
      .then(() => {
        console.log("connected to MongoDB");
      })
      
      .catch((err) => {
        console.log("error connecting to mongoose", err.message);
      });
      
  };
  module.exports = {
    connectToMongo,
  };
