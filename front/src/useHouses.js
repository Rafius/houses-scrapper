import { useEffect, useState } from "react";
import { fetchApi } from "./utils/fetch";

const useHouses = () => {
  const [houses, setHouses] = useState([]);
  const [numberOfHouses, setNumberOfHouses] = useState(houses.length);

  useEffect(() => {
    const callHousesApi = async () => {
      const { houses } = await fetchApi("http://localhost/getHouses");
      setHouses(houses);
    };
    callHousesApi();
  }, []);

  // .splice(0, numberOfHouses)

  const handleSelect = (e) => {
    setNumberOfHouses(e.target.value);
  };

  return {
    houses,

    handleSelect
  };
};

export default useHouses;
