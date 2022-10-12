const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const { google } = require("googleapis");
const path = require("path");

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
      // console.log(result.message);
    }
  );
};

app.get("/getHouses", jsonParser, async (_, res) => {
  const sql = "select * from information";

  const spreadsheetId = "1WOpdFzinKugGxClRSKvjLFAtpHPSVw0dhQ6OgIMZ_KA";

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve("./api/credentials.json"),
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  let getMeanSaving = await googleSheets.spreadsheets.values.batchGet({
    auth,
    spreadsheetId,
    ranges: "Ahorro!F16"
  });
  let [meanSaving] = getMeanSaving.data.valueRanges.at(0).values.at(0);
  meanSaving = Number(meanSaving.replace(/[^0-9]/g, "")?.slice(0, 6));

  let getCurrentMoney = await googleSheets.spreadsheets.values.batchGet({
    auth,
    spreadsheetId,
    ranges: "Ahorro!B24"
  });

  let [currentMoney] = getCurrentMoney.data.valueRanges.at(0).values.at(0);
  currentMoney = Number(currentMoney.replace(/[^0-9]/g, "")?.slice(0, 6));

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

      const priceChanges =
        pricesFiltered.at(0)?.price - pricesFiltered?.at(-1)?.price;

      return {
        ...item[0],
        price: pricesFiltered.sort((a, b) => a.date - b.date),
        priceChanges,
        pricePerMeter: pricesFiltered?.at(-1).price / surface
      };
    });

    filteredHouses = filteredHouses
      .filter(({ priceChanges }) => priceChanges > 0)
      .sort((a, b) => b.priceChanges - a.priceChanges);

    res.send({
      status: "Success",
      houses: filteredHouses,
      count: filteredHouses.length,
      meanSaving,
      currentMoney
    });
  });
});

module.exports = {
  postHouses
};
