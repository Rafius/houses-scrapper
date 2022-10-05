import { useEffect, useState } from "react";
import { fetchApi } from "./utils/fetch";

const useHouses = () => {
  const [houses, setHouses] = useState([]);
  const [sortCriteria, setSortCriteria] = useState({
    asc: false,
    key: "priceChanges"
  });

  useEffect(() => {
    const callHousesApi = async () => {
      const { houses, count } = await fetchApi("http://localhost/getHouses");
      setHouses(houses);
      console.log("casas bajadas de precio", count);
    };
    callHousesApi();
  }, []);

  const handleSortCriteriaKey = (e) => {
    setSortCriteria({ ...sortCriteria, key: e.target.value });
  };

  const handleSortCriteriaAsc = (e) => {
    setSortCriteria({ ...sortCriteria, asc: JSON.parse(e.target.value) });
  };

  houses.sort((a, b) => b[sortCriteria.key] - a[sortCriteria.key]);

  // Ordenar por bajada de precio mas reciente
  houses.sort(
    (a, b) => new Date(b.price.at(-1).date) - new Date(a.price.at(-1).date)
  );

  return {
    houses: sortCriteria.asc ? houses.reverse() : houses,
    handleSortCriteriaKey,
    handleSortCriteriaAsc
  };
};

export default useHouses;
