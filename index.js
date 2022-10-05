const { chromium } = require("playwright-chromium");
const { postHouses } = require("./api");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const scrapperHouses = async () => {
  const start = new Date().getTime();

  const browser = await chromium.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();

  const housesCount = 112;
  for (let i = 1; i <= housesCount; i++) {
    const url = `https://www.fotocasa.es/es/comprar/viviendas/malaga-provincia/todas-las-zonas/piscina/l/${i}?maxPrice=300000&searchArea=k0h38w32e-jv7C3k1qF_kl4Dpq9dimukEg5uY-24vHvzxkF081P13xmF9yrNpvhdvz-C9p2Gvz-C83_Cvz-C9p2G83_Cvz-Cvz-C83_C9p2Gvz-Cvz-C83_C4q82E-pt-Bzr37E0hjnB8qtU54zvHo91pB-3usBvk2mE2whPzxq1Go8q2L609Ojw3kO36-2Fmy3tCnlztCw4n2Jh1-1Hg8x8PryurErox1Kk9gJq_-3Rwg_uM9683D4nljI63rxCq5r1C1yg7Elhg2J_qq1B9hlB9hlBmzlB9hlB9hlBmzlB_tzEmzlB9hlB9hlBmzlB9hlB9hlBmzlB9hlB9hlBmzlBjv96Ep0wat_5lM4vthE488lD4427P8rxiCu77oGminuGm-6hDn1hJ68t-I9t3rE9olvB6szhB0xzqI0xs0M8tT8tT8tT21qMn4y0Ju0eks1zM0-imFpgh2Gy9inD3y03Pi3uHstt9Nq_hnDq_4uBnngjKzq9pColn8G4mh2LnrqvDt3tkNivvsNnv8zSi_s8QljitM6rsxBuo24P-5zgJljnoH2u8gIh9w1F2031F_llhQiophF3kwpB3i87Dgsh3B_toiBvj5Xvj5Xyx7Xvj5X`;

    await page.goto(url, { waitUntil: "networkidle" });

    // Accept cookies only first page
    if (i === 1) {
      await page.click('[data-testid="TcfAccept"]');
    }

    // Scroll down to see all element

    for (let j = 0; j <= 20; j++) {
      await delay(100);

      page.keyboard.down("PageDown");
    }

    let hrefs = await page.evaluate(() => {
      return Array.from(document.links).map((item) => item.href);
    });
    hrefs = hrefs.filter((href) => href.includes("vivienda"));
    const uniqueHrefs = [...new Set(hrefs)].slice(0, 30);

    for (let k = 0; k < uniqueHrefs.length; k++) {
      const link = uniqueHrefs[k];

      await page.goto(link);

      let price = await page.$(".re-DetailHeader-price");
      price = await price?.textContent();

      let reducedPrice = await page.$(".re-DetailHeader-reducedPrice");
      reducedPrice = await reducedPrice?.textContent();

      let features = await page.$(".re-DetailHeader-features");
      features = await features?.textContent();

      let title = await page.$(".re-DetailHeader-propertyTitle");
      title = await title?.textContent();

      let description = await page.$(".fc-DetailDescription");
      description = await description?.textContent();
      description = description?.slice(0, 4500);

      let [image] = await page.$$eval(".re-DetailMosaicPhoto", (imgs) =>
        imgs.map((img) => img.src)
      );

      const surface = features
        ?.split("m²")[0]
        ?.slice(-5)
        .trim()
        .replace(/[\D]/g, "");

      if (!price) return;
      price = price?.replace(/[^0-9]/g, "")?.slice(0, 6);
      reducedPrice = reducedPrice?.replace(/[^0-9]/g, "")?.slice(0, 6);

      const newHouse = {
        price,
        reducedPrice: reducedPrice ?? 0,
        date: new Date().toISOString().slice(0, 19).replace("T", " "),
        link,
        title,
        surface,
        description,
        image
      };

      console.log(k);
      postHouses([newHouse]);
    }
  }

  const end = new Date().getTime();
  const time = end - start;

  console.log("Execution time: " + millisToMinutesAndSeconds(time));
};

// scrapperHouses();
