const app = require('./app')
require("dotenv").config();
const mongoose = require('mongoose');


app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})

const uriDb = process.env.DB_HOST

const connection = mongoose.connect(uriDb);

connection
  .then((res) => console.log("Database connection successful"))
  .catch((err) => {
    console.log(`Database connection failed: ${err.message}`),
    process.exit(1);
  })
