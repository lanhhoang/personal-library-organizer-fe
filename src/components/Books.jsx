import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { LinkContainer } from "react-router-bootstrap";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

const apiUrl = process.env.REACT_APP_API_URL;

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
      const response = await fetch(`${apiUrl}/Books`);
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
      const response = await fetch(`${apiUrl}/Books`, {
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
      const response = await fetch(`${apiUrl}/Books/${isbn}`, {
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
    <Container>
      <h1>Book Management</h1>

      {/* Create Book Form */}
      <h2>Create Book</h2>
      <Form onSubmit={createBook}>
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Label>
              <strong>ISBN: </strong>
            </Form.Label>
          </Col>
          <Col xs="auto">
            <Form.Control
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Col>
        </Row>
      </Form>

      {/* List of Books */}
      <h2>Books</h2>
      {books.length === 0 ? (
        <p>Book List is empty</p>
      ) : (
        <Table>
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
                  <LinkContainer
                    to={`/books/show/${book.isbn}`}
                    className="mx-2"
                  >
                    <Button type="button" variant="info">
                      Show
                    </Button>
                  </LinkContainer>
                  <LinkContainer
                    to={`/books/edit/${book.isbn}`}
                    className="mx-2"
                  >
                    <Button>Edit</Button>
                  </LinkContainer>
                  <Button
                    className="mx-2"
                    type="button"
                    variant="danger"
                    onClick={(e) => deleteBook(e, book.isbn)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Books;
