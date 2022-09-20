const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());
app.listen(80, function () {
  console.log("Fotocasa running");
});

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "houses"
});

db.connect(function (err) {
  console.log("Connected to fotocasa db");
  if (err) throw err;
});

const saveHouses = (newHouses) => {
  db.query(
    "INSERT INTO `houses`.`information` (`price`, `date`, `title`, `link`, `detail`, `description`, `surface`, `image`) VALUES ?",
    [
      newHouses.map(
        ({ price, date, title, link, detail, description, surface, image }) => [
          price,
          date,
          title,
          link,
          detail,
          description,
          surface,
          image
        ]
      )
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result.message);
    }
  );
};

app.post("/saveHouses", jsonParser, async (req, res) => {
  saveHouses(req.body);
  res.send({ status: "Success" });
});

app.get("/getHouses", jsonParser, async (_, res) => {
  const sql = "select * from information";
  db.query(sql, (err, result) => {
    if (err) {
      res.flash("error", err);
    } else {
      res.send({ status: "Success", houses: result });
    }
  });
});

module.exports = {
  saveHouses
};
