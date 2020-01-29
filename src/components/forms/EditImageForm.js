import React, { Component } from "react";
import { connect } from "react-redux";
import { uploadFile } from "react-s3";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import TextField from "@material-ui/core/TextField";
import { fetchImages } from "../../actions";

const classes = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9,
    height: "100%",
    width: "100%"
  }
});

class EditImageForm extends Component {
  state = {
    caption: this.props.image.caption
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = async event => {
    const { caption } = this.state;
    const { _id } = this.props.image;
    event.preventDefault();

    await axios.put(`${process.env.REACT_APP_SERVER_URL}/images/${_id}`, {
      caption
    });

    this.props.fetchImages();

    this.props.handleClose();
  };

  render() {
    const { caption } = this.state;
    const { url } = this.props.image;
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <div key={url}>
            <CardMedia
              className={classes.cardMedia}
              src={url}
              component="img"
              title="Image title"
            />
            <label>Edit caption</label>
            <input
              type="text"
              value={caption}
              name="caption"
              onChange={this.handleInputChange}
            />
          </div>
          <button>Edit Image</button>
        </form>
      </div>
    );
  }
}

export default connect(null, { fetchImages })(
  withStyles(classes)(EditImageForm)
);
