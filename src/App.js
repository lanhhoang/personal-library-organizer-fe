import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Books from "./pages/Books";
import EditBook from "./components/EditBook";
import ShowBook from "./components/ShowBook";

function App() {
  return (
    <div className="App">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
          </ul>
        </nav>

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
      </div>
    </div>
  );
}

export default App;
