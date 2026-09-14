import "./SearchBar.css";

function SearchBar({ searchTerm, setSearchTerm, sortOrder, setSortOrder }) {
  return (
    <div className="search-container">
      <div className="search-box">
        <span className="search-icon">🔍</span>

        <input
          className="search-input"
          type="text"
          placeholder="Search places or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="sort-box">
        <span className="sort-label">Sort:</span>

        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest</option>

          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
