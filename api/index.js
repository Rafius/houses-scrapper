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
    "INSERT INTO `houses`.`information` (`id`, `title`, `link`, `detail`, `description`, `surface`, `image`, `hasGarage`) VALUES ?",
    [
      newHouses.map(
        ({
          id,
          title,
          link,
          detail,
          description,
          surface,
          image,
          hasGarage
        }) => [id, title, link, detail, description, surface, image, hasGarage]
      )
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result.message);
    }
  );
};

const saveHouses = (houses) => {
  postHouses(houses);
};

const postPrices = (prices) => {
  db.query(
    "INSERT INTO `houses`.`price` (`id`, `price`, `date`) VALUES ?",
    [prices.map(({ id, price, date }) => [id, price, date])],
    (err, result) => {
      if (err) throw err;
      console.log(result.message);
    }
  );
};

const savePrices = (prices) => {
  const housesPrice = prices.map(({ id, price }) => ({
    id,
    price: price.replace("€", ""),
    date: new Date().toISOString().slice(0, 19).replace("T", " ")
  }));
  postPrices(housesPrice);
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

app.get("/getPrices", jsonParser, async (_, res) => {
  const sql = "select * from price";
  db.query(sql, (err, result) => {
    if (err) {
      res.flash("error", err);
    } else {
      res.send({ status: "Success", prices: result });
    }
  });
});

module.exports = {
  saveHouses,
  savePrices
};
