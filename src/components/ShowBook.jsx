import React, { useState, useEffect } from "react";
import Reviews from "./Reviews";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

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
    <Container>
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

      <LinkContainer to="/books">
        <Button type="button" variant="primary">Back to Book List</Button>
      </LinkContainer>
    </Container>
  );
};

export default ShowBook;
