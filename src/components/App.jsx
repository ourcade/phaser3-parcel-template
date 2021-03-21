import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../assets/scss/main.scss"

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <h1>Hello from react</h1>
          </Route>
        </Switch>
      </Router>
    );
  }
}