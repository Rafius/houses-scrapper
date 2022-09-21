const Selector = ({ handleSelect }) => (
  <select onChange={handleSelect}>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="50">50</option>
    <option value="100">100</option>
    <option value="1000">1000</option>
  </select>
);

export default Selector;
