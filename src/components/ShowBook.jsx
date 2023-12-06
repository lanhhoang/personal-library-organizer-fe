import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Reviews from "./Reviews";

const apiUrl = process.env.REACT_APP_API_URL;

const ShowBook = ({ isbn }) => {
  const [book, setBook] = useState({});

  useEffect(() => {
    // Fetch book from API
    fetchBook();
  }, [isbn]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`${apiUrl}/Books/${isbn}`);
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error("Error fetching book: ", error);
    }
  };

  return (
    <div>
      <h1>Book Management</h1>

      <h2>Book Details</h2>
      <p>
        <strong>ISBN: </strong>
        <span>{book.isbn}</span>
      </p>
      <p>
        <strong>Title: </strong>
        <span>{book.title}</span>
      </p>
      <p>
        <strong>Author: </strong>
        <span>{book.author}</span>
      </p>
      <p>
        <strong>Published Date: </strong>
        <span>{book.publishDate}</span>
      </p>

      <Reviews isbn={isbn} />

      <Link to="/books">Back to Book List</Link>
    </div>
  );
};

export default ShowBook;
