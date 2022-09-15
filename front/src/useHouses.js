import { useEffect, useState } from "react";

const fetchApi = async (url) => {
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
    .then((res) => res.json())
    .then((response) => {
      return response;
    });
};
const useHouses = () => {
  const [houses, setHouses] = useState([]);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const callHousesApi = async () => {
      const { houses } = await fetchApi("http://localhost/getHouses");
      setHouses(houses);
    };
    const callPricesApi = async () => {
      const { prices } = await fetchApi("http://localhost/getPrices");
      setPrices(prices);
    };
    callHousesApi();
    callPricesApi();
  }, []);

  const housesWithPrices = houses?.map((house) => {
    const price = prices
      .filter((price) => price.id === house.id)
      .map(({ price, date }) => ({
        price,
        date
      }));

    return { ...house, price };
  });

  return {
    housesWithPrices
  };
};

export default useHouses;
