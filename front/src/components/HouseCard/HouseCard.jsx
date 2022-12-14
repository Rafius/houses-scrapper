import Chart from "../Chart";

const HouseCard = ({
  index,
  image,
  title,
  link,
  surface,
  price,
  priceChanges,
  currentMoney,
  meanSaving
}) => {
  const data = price?.map(({ date, price }) => {
    return {
      name: date,
      uv: price.toString().slice(0, 3)
    };
  });

  // if (price.length < 3) {
  //   return null;
  // }

  const latestPrice = price?.at(-1).price.toString().slice(0, 3);

  const monthsToBuyIt =
    ((latestPrice * 1000 - currentMoney) * 0.2) / meanSaving;

  let dateToBuy = new Date();
  dateToBuy.setMonth(dateToBuy.getMonth() + monthsToBuyIt);
  dateToBuy = `${dateToBuy.getMonth()}/${dateToBuy.getFullYear()}`;

  return (
    <div className="house" key={index}>
      <img src={image} alt={title} loading="lazy" />
      <a href={link}>
        {title}, {surface} m²
      </a>
      <p>Fecha estimada de compra: {dateToBuy}</p>
      <p>Precio: {latestPrice}K €</p>
      <p>Precio por m²: {parseInt(price?.at(-1).price / surface)} €</p>
      <p>Precio original: {price.at(0).price.toString().slice(0, 3)}K €</p>
      <p>Precio por m² original: {parseInt(price?.at(0).price / surface)} €</p>
      <p>El precio ha bajado: {priceChanges} €</p>
      <Chart data={data} priceChanges={priceChanges} />
    </div>
  );
};

export default HouseCard;
