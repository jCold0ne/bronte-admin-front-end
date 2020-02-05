import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchPosts, fetchImages } from "../../actions";
import axios from "axios";

class DeleteForm extends Component {
  onFormSubmit = async event => {
    const { token } = this.props;
    const { _id } = this.props.post;
    event.preventDefault();

    try {
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
    const { title, body, imageUrl, imageName } = this.props.post;

    return (
      <form>
        <h1 style={{ color: "#F50057" }}>
          Are you sure you want to delete this post?
        </h1>
        <div
          style={{
            display: "inline-flex",
            borderRadius: 2,
            marginBottom: 8,
            marginRight: 8,
            width: 100,
            height: 100,
            padding: 4,
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              display: "flex",
              minWidth: 0,
              overflow: "hidden"
            }}
          >
            <img
              src={imageUrl}
              alt={imageName}
              style={{
                display: "block",
                width: "auto",
                height: "100%"
              }}
            />
          </div>
        </div>
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
