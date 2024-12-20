const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const mongoConnect = require("./utils/authDB");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// app.use(cors());
app.use(cors({ origin: 'http://localhost:5174' })); 

app.use(express.json());

mongoConnect.connectToMongo();

app.use("/users", userRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
