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
    const { token } = this.props;
    const { _id, imageId } = this.props.post;
    event.preventDefault();

    try {
      // delete image from mongodb/s3
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/images/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // delete post from mongodb
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

const mapStateToProps = state => ({
  token: state.auth.token
});

export default connect(mapStateToProps, { fetchPosts, fetchImages })(
  DeleteForm
);
