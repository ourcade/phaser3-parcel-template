import React from "react";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "../assets/scss/main.scss"

import NavBar from './layout/NavBar'

export default class App extends React.Component {
  render() {
    return (
      <>
        <NavBar />
      </>
    );
  }
}