import React, {useState} from 'react'

function FilterMap() {
    const [filter, setFilter] = useState(0);
  return (
    <div className="filter">
    <input
      type="text"
      name="name"
      className="input__filter"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
  </div>
  )
}

export default FilterMap