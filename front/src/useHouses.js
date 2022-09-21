import { useEffect, useState } from "react";
import { fetchApi } from "./utils/fetch";

const useHouses = () => {
  const [houses, setHouses] = useState([]);
  const [prices, setPrices] = useState([]);
  const [numberOfHouses, setNumberOfHouses] = useState(100);

  useEffect(() => {
    const callPricesApi = async () => {
      const { prices } = await fetchApi("http://localhost/getPrices");
      setPrices(prices);
    };
    const callHousesApi = async () => {
      const { houses } = await fetchApi("http://localhost/getHouses");
      setHouses(houses);
    };
    callPricesApi();
    callHousesApi();
  }, []);

  const housesWithPrices = houses?.splice(0, numberOfHouses).map((house) => {
    const price = prices
      .filter((price) => price.link === house.link)
      .map(({ price, date }) => ({
        price: price?.toLocaleString(),
        date
      }));

    return { ...house, price };
  });

  const handleSelect = (e) => {
    setNumberOfHouses(e.target.value);
  };

  return {
    housesWithPrices: housesWithPrices.sort(
      (a, b) => a.price[0].price - b.price[0].price
    ),
    handleSelect
  };
};

export default useHouses;
