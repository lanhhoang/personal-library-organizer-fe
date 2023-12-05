import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isbn, setIsbn] = useState("");

  useEffect(() => {
    // Fetch books from API or database
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // Make an API call to fetch books
      const response = await fetch("/api/Books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const createBook = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to create a new book
      const response = await fetch("/api/Books", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isbn,
          title: "TBA",
          author: "TBA",
          publishDate: "TBA",
        }),
        // body: `${isbn}`,
      });
      const createdBook = await response.json();
      setBooks([...books, createdBook]);
      setIsbn("");
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const deleteBook = async (e, isbn) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/Books/${isbn}`, {
        method: "DELETE",
        headers: { accept: "*/*" },
      });
      
      if (response.status === 204) {
        // Book deleted successfully
        // Modify the books state by filtering out the deleted book
        const updatedBooks = books.filter((book) => book.isbn !== isbn);
        setBooks(updatedBooks);

        // Fetch books again to update the book list
        fetchBooks();
      } else {
        // Handle other response codes
        console.error("Error deleting book. Status: ", response.status);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div>
      <h1>Book Management</h1>

      {/* Create Book Form */}
      <h2>Create Book</h2>
      <form onSubmit={createBook}>
        <label>
          <strong>ISBN: </strong>
        </label>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <br />
        <button type="submit">Create</button>
      </form>

      {/* List of Books */}
      <h2>Books</h2>
      {books.length === 0 ? (
        <p>Book List is empty</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.isbn}>
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publishDate}</td>
                <td colSpan={3}>
                  <Link to={`/books/show/${book.isbn}`}>Show</Link>
                  <Link to={`/books/edit/${book.isbn}`}>Edit</Link>
                  <button
                    type="button"
                    onClick={(e) => deleteBook(e, book.isbn)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Books;
