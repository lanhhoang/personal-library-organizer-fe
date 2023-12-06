import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShowReviews from "./ShowReviews";

const ShowBook = ({ isbn }) => {
  const [book, setBook] = useState({});

  useEffect(() => {
    // Fetch book from API
    fetchBook();
  }, [isbn]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/Books/${isbn}`);
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

      <ShowReviews isbn={isbn} />

      <Link to="/books">Back to Book List</Link>
    </div>
  );
};

export default ShowBook;
