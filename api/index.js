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

const postHouses = (newHouses) => {
  db.query(
    "INSERT INTO `houses`.`information` ( `title`, `link`,  `description`, `surface`, `image`) VALUES ?",
    [
      newHouses.map(({ title, link, description, surface, image }) => [
        title,
        link,
        description,
        surface,
        image
      ])
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result.message);
    }
  );
};

const postPrice = (newHouses) => {
  db.query(
    "INSERT INTO `houses`.`price` (`price`, `date`, `link`) VALUES ?",
    [newHouses.map(({ price, date, link }) => [price, date, link])],
    (err) => {
      if (err) throw err;
    }
  );
};

const getHousesLink = (newHouses) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT link from `houses`.`information`";
    db.query(sql, (err, result) => {
      if (err) {
        reject(new Error());
      } else {
        resolve(result);
      }
    });
  });
};

app.get("/getHouses", jsonParser, async (_, res) => {
  const sql = "select * from information";
  db.query(sql, (err, houses) => {
    if (err) {
      res.flash("error", err);
    } else {
      res.send({ status: "Success", houses });
    }
  });
});

app.get("/getPrices", jsonParser, async (_, res) => {
  const sql = "select * from price";
  db.query(sql, (err, prices) => {
    if (err) {
      res.flash("error", err);
    } else {
      res.send({ status: "Success", prices });
    }
  });
});

module.exports = {
  postHouses,
  getHousesLink,
  postPrice
};
