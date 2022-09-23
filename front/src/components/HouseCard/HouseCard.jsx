import Chart from "../Chart";

const HouseCard = ({
  index,
  image,
  title,
  link,
  surface,
  price,
  priceChanges
}) => {
  const data = price?.map(({ date, price }) => {
    return {
      name: date,
      uv: price.toString().slice(0, 3)
    };
  });

  console.log(priceChanges);

  return (
    <div className="house" key={index}>
      <img src={image} alt={title} loading="lazy" />
      <a href={link}>
        {title}, {surface} m²
      </a>
      <p>Precio: {price?.at(-1).price.toString().slice(0, 3)}K €</p>
      <p>
        Precio por m²:{" "}
        {parseFloat(price?.at(-1).price / surface)
          .toString()
          .slice(0, 3)}{" "}
        K €
      </p>
      <p>Precio original: {price.at(0).price.toString().slice(0, 3)}K €</p>
      <p>
        Precio por m² original:{" "}
        {parseFloat(price?.at(0).price / surface)
          .toString()
          .slice(0, 3)}{" "}
        K €
      </p>
      <p>El precio ha bajado: {priceChanges} €</p>
      <Chart data={data} priceChanges={priceChanges} />
    </div>
  );
};

export default HouseCard;
