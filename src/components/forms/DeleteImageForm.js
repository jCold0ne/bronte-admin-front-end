import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchImages } from "../../actions";
import axios from "axios";

class DeleteImageForm extends Component {
  onFormSubmit = async event => {
    event.preventDefault();

    // try {
    //   const { _id, name } = this.props.image;
    //   console.log(name);
    //   await deleteFile(name, config);
    //   const response = await axios.delete(
    //     `${process.env.REACT_APP_SERVER_URL}/images/${_id}`
    //   );
    //   await this.props.fetchImages(response.data);
    //   this.props.handleClose();
    // } catch (error) {
    //   console.log(error);
    // }
  };

  render() {
    const { url, caption } = this.props;

    return (
      <form>
        <h1 style={{ color: "#F50057" }}>
          Are you sure you want to delete this image?
        </h1>
        <img src={url} alt={caption} />
        <p>{caption}</p>
        <Button
          variant="contained"
          color="secondary"
          type="button"
          onClick={this.onFormSubmit}
        >
          Delete Image
        </Button>
      </form>
    );
  }
}

export default connect(null, { fetchImages })(DeleteImageForm);
