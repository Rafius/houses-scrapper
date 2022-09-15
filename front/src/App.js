import "./App.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import useHouses from "./useHouses";

function App() {
  const { housesWithPrices } = useHouses();

  console.log(housesWithPrices.filter(({ price }) => price.length > 2));
  return (
    <div className="container">
      {housesWithPrices
        .slice(0, 100)
        .map(
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

            const priceChanges =
              Number(price[0]?.price) - Number(price?.at(-1)?.price).toFixed(2);

            return (
              <div className="house" key={id}>
                <a href={link}>
                  {title}, {surface} m²
                </a>
                <img src={image} alt={description} loading="lazy" />
                <p>Precio: {price?.at(-1).price}K €</p>
                <p>
                  Precio por m²:{" "}
                  {parseFloat((price?.at(-1).price * 1000) / surface).toFixed(
                    2
                  )}
                  K €
                </p>
                <p>Precio original: {price.at(0).price}K €</p>
                <p>
                  Precio por m² original:{" "}
                  {parseFloat((price?.at(0).price * 1000) / surface).toFixed(2)}
                  K €
                </p>
                <p>El precio ha bajado: {priceChanges}K €</p>
                <p>{!hasGarage && "No"} Tiene garaje </p>
                {priceChanges > 0 && (
                  <LineChart
                    width={600}
                    height={300}
                    data={data}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis dateKey="date" domain={[100, 600]} />
                    <Tooltip />
                  </LineChart>
                )}
              </div>
            );
          }
        )}
    </div>
  );
}

export default App;
