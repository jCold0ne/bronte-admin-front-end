import React, { Component } from "react";
import Login from "./pages/Login";
import Create from "./pages/Create";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/create" component={Create} />
            </Switch>
          </div>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
