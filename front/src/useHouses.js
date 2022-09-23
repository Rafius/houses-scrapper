import { useEffect, useState } from "react";
import { fetchApi } from "./utils/fetch";

const useHouses = () => {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const callHousesApi = async () => {
      const { houses, count } = await fetchApi("http://localhost/getHouses");
      setHouses(houses);
      console.log("casas bajadas de precio", count);
    };
    callHousesApi();
  }, []);

  const handleSelect = (e) => {
    // setNumberOfHouses(e.target.value);
  };

  return {
    houses,
    handleSelect
  };
};

export default useHouses;
