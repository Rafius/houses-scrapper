const Selector = ({ handleSelect, options }) => (
  <select onChange={handleSelect}>
    {options?.map(({ value, text }) => (
      <option value={value} key={value}>
        {text}
      </option>
    ))}
  </select>
);

export default Selector;
