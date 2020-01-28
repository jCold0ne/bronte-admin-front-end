import React, { Component } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
