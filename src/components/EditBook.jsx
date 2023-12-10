import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";


import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

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
    <Container>
      <h1>Book Management</h1>

      {/* Edit Book Form */}
      <h2>Edit Book</h2>
      <Form onSubmit={editBook}>
        <Row className="align-items-center">
          <Col xs="1">
            <Form.Label>
              <strong>ISBN: </strong>
            </Form.Label>
          </Col>
          <Col xs="6">
            <Form.Control type="type" value={isbn} disabled />
          </Col>
        </Row>
        <br />
        <Row className="align-items-center">
          <Col xs="1">
            <Form.Label>
              <strong>Title: </strong>
            </Form.Label>
          </Col>
          <Col xs="6">
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Row className="align-items-center">
          <Col xs="1">
            <Form.Label>
              <strong>Author: </strong>
            </Form.Label>
          </Col>
          <Col xs="6">
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Row className="align-items-center">
          <Col xs="1">
            <Form.Label>
              <strong>Available: </strong>
            </Form.Label>
          </Col>
          <Col xs="6">
            <Form.Control
              type="text"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Button type="submit" variant="success">
          Edit
        </Button>
      </Form>
    </Container>
  );
};

export default EditBook;
