require("dotenv").config();
var express = require('express');
var app = express();
 
const db = require("./db");
const route = require("./routes/route");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(route);

(async () => {
    try {
      await db.init();
      app.listen(process.env.PORT, () => console.log(`Server is running at 0.0.0.0:${process.env.PORT}`));
    } catch (error) {
      console.log(error.message);
    }
  })();
  