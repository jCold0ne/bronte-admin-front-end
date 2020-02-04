import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchPosts, fetchImages } from "../../actions";
import axios from "axios";

class DeleteForm extends Component {
  state = {
    title: "",
    body: "",
    imageName: "",
    imageUrl: "",
    error: ""
  };

  componentDidMount() {
    const { title, body } = this.props.post;
    this.setState({ title, body });
  }

  onFormSubmit = async event => {
    event.preventDefault();

    // try {
    //   const { _id, imageName } = this.props.post;
    //   await deleteFile(imageName, config);
    //   const response = await axios.delete(
    //     `${process.env.REACT_APP_SERVER_URL}/posts/${_id}`
    //   );
    //   await this.props.fetchPosts(response.data);
    //   this.props.handleClose();
    // } catch (error) {}

    try {
      const { _id, imageId } = this.props.post;
      // delete image from mongodb/s3
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/images/${imageId}`
      );

      // delete post from mongodb
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${_id}`);

      // fetch posts
      await this.props.fetchPosts();

      // fetch images
      await this.props.fetchImages();

      // close modal

      this.props.handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { title, body } = this.state;

    return (
      <form>
        <h1 style={{ color: "#F50057" }}>
          Are you sure you want to delete this post?
        </h1>
        <h3>{title}</h3>
        <p>{body}</p>
        <Button
          variant="contained"
          color="secondary"
          type="button"
          onClick={this.onFormSubmit}
        >
          Delete Post
        </Button>
      </form>
    );
  }
}

export default connect(null, { fetchPosts, fetchImages })(DeleteForm);
