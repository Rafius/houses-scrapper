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

  useEffect(() => {
    const callHousesApi = async () => {
      const { houses } = await fetchApi("http://localhost/getHouses");
      setHouses(houses.splice(0, 100));
    };

    callHousesApi();
  }, []);

  const housesGroupById = houses?.reduce((acc, house) => {
    (acc[house.id] = acc[house.id] || []).push(house);
    return acc;
  }, {});

  const housesWithPrices = Object.values(housesGroupById)
    .flatMap((currentHouse) => {
      if (currentHouse.length === 1) {
        return {
          ...currentHouse[0],
          price: [
            {
              price: currentHouse[0].price,
              date: currentHouse[0].date
            }
          ]
        };
      }

      const houseIsOnSale =
        currentHouse.at(-1).price[0].date === new Date().toLocaleDateString();

      if (!houseIsOnSale) return null;

      const house = currentHouse.at(0);

      const prices = currentHouse.price?.map(({ price }) => price);

      const newHouse = currentHouse.at(-1);

      const isNewPrice = !prices.includes(newHouse.price[0].price);
      if (isNewPrice) house.price.push(newHouse.price[0]);

      return currentHouse;
    })
    .filter((x) => x);

  return {
    housesWithPrices
  };
};

export default useHouses;
