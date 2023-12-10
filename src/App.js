import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Home from "./pages/Home";
import Books from "./components/Books";
import EditBook from "./components/EditBook";
import ShowBook from "./components/ShowBook";

import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
            Group 5 - Personal Library Organizer
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/books">Books</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          path="/books/edit/:isbn"
          render={(props) => <EditBook isbn={props.match.params.isbn} />}
        />
        <Route
          path="/books/show/:isbn"
          render={(props) => <ShowBook isbn={props.match.params.isbn} />}
        />
        <Route path="/books" component={Books} />
      </Switch>
    </>
  );
}

export default App;
