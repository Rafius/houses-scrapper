import "./App.css";
import Chart from "./Chart";

import useHouses from "./useHouses";

function App() {
  const { housesWithPrices } = useHouses();

  // console.log(housesWithPrices);

  return (
    <div className="container">
      {housesWithPrices?.map(
        ({
          description,
          id,
          image,
          hasGarage,
          link,
          surface,
          price,
          title
        }) => {
          if (!price.length > 0) return null;

          const data = price?.map(({ date, price }) => {
            return {
              name: date,
              uv: price
            };
          });

          let priceChanges;
          if (price.length > 1)
            priceChanges =
              Number(price[0]?.price) - Number(price?.at(-1)?.price).toFixed(2);

          // if (!priceChanges) return null;
          return (
            <div className="house" key={id}>
              <img src={image} alt={description} loading="lazy" />
              <a href={link}>
                {title}, {surface} m²
              </a>
              <p>Precio: {price?.at(-1).price}K €</p>
              <p>
                Precio por m²:{" "}
                {parseFloat((price?.at(-1).price * 1000) / surface).toFixed(2)}K
                €
              </p>
              <p>Precio original: {price.at(0).price}K €</p>
              <p>
                Precio por m² original:{" "}
                {parseFloat((price?.at(0).price * 1000) / surface).toFixed(2)}K
                €
              </p>
              <p>El precio ha bajado: {priceChanges}K €</p>
              <p>{!hasGarage && "No"} Tiene garaje </p>
              <Chart data={data} priceChanges={priceChanges} />
            </div>
          );
        }
      )}
    </div>
  );
}

export default App;
