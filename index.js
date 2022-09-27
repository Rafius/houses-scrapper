const { chromium } = require("playwright-chromium");
const { postHouses, postPrice, getHouses } = require("./api");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const url =
  "https://www.fotocasa.es/es/comprar/viviendas/malaga-provincia/todas-las-zonas/piscina/l/7?mapBoundingBox=46_kp13tgBjzo8_lG-21w9tmBhl5-_lG&maxPrice=300000";
const scrapperHouses = async () => {
  const start = new Date().getTime();

  const browser = await chromium.launch({
    headless: true,
    defaultViewport: null
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  // Accept cookies
  await page.click('[data-testid="TcfAccept"]');

  let [housesCount] = await page.$$(".re-SearchTitle-count");
  housesCount = await housesCount.textContent();

  housesCount = Math.ceil(housesCount / 0.03);

  for (let i = 1; i <= housesCount; i++) {
    const houses = [];

    // Scroll down to see all element

    for (let j = 0; j <= 20; j++) {
      await delay(150);
      page.keyboard.down("PageDown");
    }

    // Get all houses

    const titles = await page.$$(".re-CardTitle");
    const surfaces = await page.$$(
      ".re-CardFeaturesWithIcons-feature-icon--surface"
    );
    let hrefs = await page.evaluate(() => {
      return Array.from(document.links).map((item) => item.href);
    });

    let images = await page.$$eval(".re-CardMultimediaSlider-image", (imgs) =>
      imgs.map((img) => img.src)
    );

    images = images.filter((image) => image.includes("static"));
    hrefs = hrefs.filter((href) => href.includes("vivienda"));
    const uniqueHrefs = [...new Set(hrefs)].slice(0, 30);

    for (let k = 0; k < uniqueHrefs.length; k++) {
      const title = await titles[k]?.textContent();
      const image = await images[k];
      const link = uniqueHrefs[k];
      const surface = await surfaces[k]?.textContent();

      if (!title) continue;
      houses.push({
        title,
        image,
        link,
        surface
      });
    }

    const newHouses = houses.map((house) => ({
      ...house,
      description: house.description?.slice(0, 255),
      surface: house.surface?.replace(/[\D]/g, "")
    }));

    postHouses(newHouses);
    const nextPage = await page.$$(".sui-MoleculePagination-item");
    nextPage.at(-1)?.click();

    const currentPercentage = (i * 100) / housesCount;
    console.log(currentPercentage.toFixed(2), "%");
  }

  const end = new Date().getTime();
  const time = end - start;

  console.log("Execution time: " + millisToMinutesAndSeconds(time));
  scrapperPrices();
};

const scrapperPrices = async () => {
  const browser = await chromium.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();
  const startTime = new Date().getTime();
  getHouses().then(async (houses) => {
    for (let i = 8610; i < houses.length; i++) {
      if (!houses[i]) continue;
      const { link, title } = houses[i];

      await page.goto(link);

      let [price] = await page.$$(".re-DetailHeader-price");
      price = await price?.textContent();
      let [features] = await page.$$(".re-DetailHeader-features");
      features = await features?.textContent();

      const surface = features
        ?.split("m²")[0]
        ?.slice(-5)
        .trim()
        .replace(/[\D]/g, "");

      if (!price) continue;
      price = price?.replace(/[^0-9]/g, "")?.slice(0, 6);

      const newPrice = {
        price,
        date: new Date().toISOString().slice(0, 19).replace("T", " "),
        link,
        title,
        surface
      };

      postPrice([newPrice]);
      const currentPercentage = (i / houses.length) * 100;
      console.log(currentPercentage.toFixed(2), "%", i);
    }

    const endTime = new Date().getTime();
    console.log(
      "Execution time: " + millisToMinutesAndSeconds(endTime - startTime)
    );
    browser.close();
  });
};

// scrapperHouses();
scrapperPrices();

// for (let index = 0; index <= 9; index++) {
//   scrapperPrices(index * 1000, (index + 1) * 1000);
// }
