import React, { Component } from "react";
import { deleteFile } from "react-s3";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchImages } from "../../actions";
import axios from "axios";

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
  dirName: "photos",
  region: process.env.REACT_APP_S3_BUCKET_REGION,
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY
};

class DeleteImageForm extends Component {
  onFormSubmit = async event => {
    event.preventDefault();

    try {
      const { _id } = this.props.image;
      await deleteFile();
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/posts/${_id}`
      );
      await this.props.fetchImages(response.data);
      this.props.handleClose();
    } catch (error) {}
  };

  render() {
    const { url, caption } = this.props;

    return (
      <form onSubmit={this.onFormSubmit}>
        <h1 style={{ color: "#F50057" }}>
          Are you sure you want to delete this image?
        </h1>
        <img src={url} alt={caption} />
        <p>{caption}</p>
        <Button variant="contained" color="secondary" type="button">
          Delete Post
        </Button>
      </form>
    );
  }
}

export default connect(null, { fetchImages })(DeleteImageForm);
