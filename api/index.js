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
    "INSERT INTO `houses`.`information` ( `title`, `link`, `description`, `surface`, `image`, `price`, `reducedPrice`, `date`) VALUES ?",
    [
      newHouses.map(
        ({
          title,
          link,
          description,
          surface,
          image,
          price,
          reducedPrice,
          date
        }) => [
          title,
          link,
          description,
          surface,
          image,
          price,
          reducedPrice,
          date
        ]
      )
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result.message);
    }
  );
};

app.get("/getHouses", jsonParser, async (_, res) => {
  const sql = "select * from information";
  db.query(sql, (err, houses) => {
    if (err) {
      return res.flash("error", err);
    }
    const results = houses.reduce((prev, current) => {
      (prev[current.link] = prev[current.link] || []).push(current);
      return prev;
    }, {});

    let filteredHouses = Object.values(results).map((item) => {
      const pricesWithDate = item.map(({ price, date }) => {
        return {
          price,
          date
        };
      });
      const prices = item.map(({ price }) => price);

      const pricesFiltered = pricesWithDate.filter(
        ({ price }, index) => !prices.includes(price, index + 1)
      );

      const { surface } = item.find(({ surface }) => surface) || {};

      return {
        ...item[0],
        price: pricesFiltered.sort((a, b) => a.date - b.date),
        priceChanges:
          pricesFiltered.at(0)?.price - pricesFiltered?.at(-1)?.price,
        pricePerMeter: pricesFiltered?.at(-1).price / surface
      };
    });

    filteredHouses = filteredHouses
      .filter(({ priceChanges }) => priceChanges > 0)
      .sort((a, b) => b.priceChanges - a.priceChanges);

    res.send({
      status: "Success",
      houses: filteredHouses,
      count: filteredHouses.length
    });
  });
});

module.exports = {
  postHouses
};
