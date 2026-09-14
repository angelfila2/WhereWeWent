import "./App.css";
import { useState, useEffect } from "react";
import AddEntry from "./components/AddEntry";
import EntryCard from "./components/EntryCard";
import SearchBar from "./components/SearchBar";

function App() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchEntries();
  }, []);

  // Get all entries from Django
  const fetchEntries = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/entries/");

      const data = await response.json();

      setEntries(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEntries = entries
    .filter((entry) => {
      const search = searchTerm.toLowerCase();

      return (
        entry.placeName.toLowerCase().includes(search) ||
        entry.location.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.timeWeWent);
      const dateB = new Date(b.timeWeWent);

      if (sortOrder === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

  return (
    <>
      <h1>Where We Went</h1>
      <AddEntry onEntryAdded={fetchEntries} />

      <div>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        ;<h2>Places We've Been</h2>
        {filteredEntries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onEntryUpdated={fetchEntries}
          />
        ))}
      </div>
    </>
  );
}

export default App;
