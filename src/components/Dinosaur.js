import React, { Component } from "react";

class Dinosaur extends Component {
  render() {
    const image = require("../images/dinosaur.jpg");
    return (
      <div>
        <img src={image} alt="dinosaur" />
      </div>
    );
  }
}

export default Dinosaur;
