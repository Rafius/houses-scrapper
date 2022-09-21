import Chart from "../Chart";

const HouseCard = ({ index, image, title, link, surface, price }) => {
  const data = price?.map(({ date, price }) => ({
    name: date,
    uv: price
  }));

  let priceChanges;
  if (price.length > 1)
    priceChanges =
      Number(price[0]?.price) - Number(price?.at(-1)?.price).toFixed(2);

  return (
    <div className="house" key={index}>
      <img src={image} alt={title} loading="lazy" />
      <a href={link}>
        {title}, {surface} m²
      </a>
      <p>Precio: {price?.at(-1).price} €</p>
      <p>
        Precio por m²:{" "}
        {parseFloat((price?.at(-1).price * 1000) / surface).toFixed(2)} €
      </p>
      <p>Precio original: {price.at(0).price} €</p>
      <p>
        Precio por m² original:{" "}
        {parseFloat((price?.at(0).price * 1000) / surface).toFixed(2)} €
      </p>
      <p>El precio ha bajado: {priceChanges} €</p>
      <Chart data={data} priceChanges={priceChanges} />
    </div>
  );
};

export default HouseCard;
