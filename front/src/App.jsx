import "./App.css";
import Selector from "./components/Selector";
import HouseCard from "./components/HouseCard";

import useHouses from "./useHouses";

const sortCriteriaKey = [
  {
    value: "priceChanges",
    text: "bajada de precio"
  },
  {
    value: "pricePerMeter",
    text: "precio por metro"
  },
  {
    value: "price",
    text: "precio"
  },
  {
    value: "surface",
    text: "metros"
  }
];

const sortCriteriaAsc = [
  {
    value: true,
    text: "ascendente"
  },
  {
    value: false,
    text: "descendente"
  }
];

function App() {
  const { houses, handleSortCriteriaKey, handleSortCriteriaAsc } = useHouses();

  const priceMean =
    houses.reduce((acc, current) => {
      return acc + current.priceChanges;
    }, 0) / houses.length;

  console.log("Media de bajada de precio", priceMean);

  return (
    <div>
      <Selector
        handleSelect={handleSortCriteriaKey}
        options={sortCriteriaKey}
      />
      <Selector
        handleSelect={handleSortCriteriaAsc}
        options={sortCriteriaAsc}
      />
      <div className="houses-container">
        {houses?.map((item, index) => (
          <HouseCard {...item} key={index} />
        ))}
      </div>
    </div>
  );
}

export default App;
