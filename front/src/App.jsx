import "./App.css";
import Selector from "./components/Selector";
import HouseCard from "./components/HouseCard";

import useHouses from "./useHouses";

function App() {
  const { housesWithPrices, handleSelect } = useHouses();

  return (
    <div>
      <Selector handleSelect={handleSelect} />
      <div className="houses-container">
        {housesWithPrices?.map((item, index) => (
          <HouseCard {...item} key={index} />
        ))}
      </div>
    </div>
  );
}

export default App;
