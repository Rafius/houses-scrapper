const { chromium } = require("playwright-chromium");
const { saveHouses, savePrices } = require("./fotocasa");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const url =
  "https://www.fotocasa.es/es/comprar/viviendas/malaga-provincia/todas-las-zonas/piscina/l?maxPrice=300000&searchArea=42nh5hi5ethe969Bn7qDl7qDnh4Qo-iFivuUg1ixvEx9mH1ry3C313xCs1xgB__tTkxhhCzsqD4z64Eywqfpx5Hv8_B67iOki1F08vSgnrXr13D_vskCg-y9Bot92BzjlyGlj836Cqw1Q5oiuE403mB9mrNkvs32B2tkxgDx--3GspqoR3pqNjn3Jp0wa1xqVzjkqM9i88F9-x97Bs80xOyh75Lg8whD6tqkCr7Flit_k8F";
const scrapper = async () => {
  const start = new Date().getTime();

  const browser = await chromium.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  // Accept cookies
  await page.click('[data-testid="TcfAccept"]');
  const houses = [];

  const numberOfPages = 66;
  for (let i = 1; i <= numberOfPages; i++) {
    // Scroll down to see all element

    for (let j = 0; j <= 20; j++) {
      await delay(150);
      page.keyboard.down("PageDown");
    }

    // Get all houses

    const prices = await page.$$(".re-CardPrice");
    const titles = await page.$$(".re-CardTitle");
    const features = await page.$$(".re-CardFeaturesWithIcons-wrapper");
    const descriptions = await page.$$(".re-CardDescription-text");
    const phones = await page.$$(".re-CardContact-phone");
    const surface = await page.$$(
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

    for (let k = 0; k < prices.length; k++) {
      houses.push({
        id: Number(uniqueHrefs[k]?.replace(/[\D]/g, "")?.slice(-9)),
        price: await prices[k]?.textContent(),
        title: await titles[k]?.textContent(),
        image: await images[k],
        feature: await features[k]?.textContent(),
        description: await descriptions[k]?.textContent(),
        phone: await phones[k]?.textContent(),
        link: uniqueHrefs[k],
        surface: await surface[k]?.textContent()
      });
    }
    const nextPage = await page.$$(".sui-MoleculePagination-item");
    nextPage.at(-1)?.click();
    console.log("current page", i, houses.length);
  }
  debugger;
  const ids = houses.map(({ id }) => id);
  const filteredHouses = houses
    .filter(({ id }, index) => !ids.includes(id, index + 1) && id)
    .map((house) => ({
      ...house,
      description: house.description?.slice(0, 255),
      surface: house.surface?.slice(0, 2)
    }));

  debugger;
  saveHouses(filteredHouses);
  savePrices(filteredHouses);

  const end = new Date().getTime();
  const time = end - start;
  console.log("Execution time: " + millisToMinutesAndSeconds(time));
};

scrapper();
