import "./App.css";
import Selector from "./components/Selector";
import HouseCard from "./components/HouseCard";

import useHouses from "./useHouses";

function App() {
  const { houses, handleSelect } = useHouses();

  houses.forEach((item) => {
    if (item.price.length > 1) console.log(item);
  });
  return (
    <div>
      <Selector handleSelect={handleSelect} />
      <div className="houses-container">
        {houses?.map((item, index) => (
          <HouseCard {...item} key={index} />
        ))}
      </div>
    </div>
  );
}

export default App;
