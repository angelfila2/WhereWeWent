import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Book website</h1>
      <div>
        <input type="text" placeholder="Search for a book" />
        <input type="date" placeholder="Release date" />
        <button> Add button </button>
      </div>

      <div>
        <h2>Books</h2>
        {books.map((book) => (
          <div key={book.id}>
            <h2>{book.title}</h2>
            <p>Release Year: {book.release_year}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
