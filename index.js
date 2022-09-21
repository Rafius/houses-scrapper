const { chromium } = require("playwright-chromium");
const { postHouses, postPrice, getHousesLink } = require("./api");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const url =
  "https://www.fotocasa.es/es/comprar/viviendas/malaga-provincia/todas-las-zonas/piscina/l?maxPrice=300000&searchArea=42nh5hi5ethe969Bn7qDl7qDnh4Qo-iFivuUg1ixvEx9mH1ry3C313xCs1xgB__tTkxhhCzsqD4z64Eywqfpx5Hv8_B67iOki1F08vSgnrXr13D_vskCg-y9Bot92BzjlyGlj836Cqw1Q5oiuE403mB9mrNkvs32B2tkxgDx--3GspqoR3pqNjn3Jp0wa1xqVzjkqM9i88F9-x97Bs80xOyh75Lg8whD6tqkCr7Flit_k8F";
// "https://www.fotocasa.es/es/comprar/viviendas/malaga-provincia/todas-las-zonas/l";

const scrapperHouses = async () => {
  const start = new Date().getTime();

  const browser = await chromium.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  // Accept cookies
  await page.click('[data-testid="TcfAccept"]');

  const numberOfPages = 69;
  for (let i = 1; i <= numberOfPages; i++) {
    const houses = [];

    // Scroll down to see all element

    for (let j = 0; j <= 20; j++) {
      await delay(150);
      page.keyboard.down("PageDown");
    }

    // Get all houses

    const titles = await page.$$(".re-CardTitle");
    const surface = await page.$$(
      ".re-CardFeaturesWithIcons-feature-icon--surface"
    );
    // re - CardFeaturesWithIcons - feature - icon;
    // re - CardFeaturesWithIcons - feature - icon--surface
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
      houses.push({
        title: await titles[k]?.textContent(),
        image: await images[k],
        link: uniqueHrefs[k],
        surface: await surface[k]?.textContent()
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

    console.log("current page", i, houses.length);
  }

  const end = new Date().getTime();
  const time = end - start;

  console.log("Execution time: " + millisToMinutesAndSeconds(time));
};

const scrapperPrices = async () => {
  const browser = await chromium.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();

  getHousesLink().then(async (links) => {
    const start = new Date().getTime();

    for (let i = 1270; i < links.length; i++) {
      const link = links[i].link;
      await page.goto(link, { waitUntil: "networkidle" });
      let [price] = await page.$$(".re-DetailHeader-priceContainer");
      price = await price?.textContent();

      price = price?.replace(/[^0-9]/g, "")?.slice(0, 6);
      const newPrice = {
        price,
        date: new Date().toISOString().slice(0, 19).replace("T", " "),
        link
      };

      postPrice([newPrice]);
      console.log("current page", i + 1, links.length, price);
    }
    const end = new Date().getTime();
    const time = end - start;

    console.log("Execution time: " + millisToMinutesAndSeconds(time));
  });
};

// scrapperHouses();

scrapperPrices();
