import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const EditBook = ({ isbn }) => {
  const history = useHistory();

  const [book, setBook] = useState({});
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");

  useEffect(() => {
    // Fetch book from API
    fetchBook();
  }, [isbn]);

  useEffect(() => {
    // Update form input values when book state changes
    setTitle(book.title);
    setAuthor(book.author);
    setPublishDate(book.publishDate);
  }, [book]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`${apiUrl}/Books/${isbn}`);
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error("Error fetching book: ", error);
    }
  };

  const editBook = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to edit a new book
      const response = await fetch(`${apiUrl}/Books/${isbn}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn, title, author, publishDate }),
      });
      const editBook = await response.json();

      console.log(editBook);

      setTitle("");
      setAuthor("");
      setPublishDate("");

      // Redirect to Books page
      history.push("/books");
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <div>
      <h1>Book Management</h1>

      {/* Edit Book Form */}
      <h2>Edit Book</h2>
      <form onSubmit={editBook}>
        <label>
          <strong>ISBN: </strong>
        </label>
        <input
          type="type"
          value={isbn}
          disabled
        />
        <br />
        <label>
          <strong>Title: </strong>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label>
          <strong>Author: </strong>
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <br />
        <label>
          <strong>Available: </strong>
        </label>
        <input
          type="text"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
        />
        <br />
        <button type="submit">Edit</button>
      </form>
    </div>
  );
};

export default EditBook;
