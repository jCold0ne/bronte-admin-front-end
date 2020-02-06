import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { fetchPosts, fetchImages } from "../../actions";
import axios from "axios";

class DeleteForm extends Component {
  state = {
    loading: false
  };

  handleFormSubmit = async event => {
    const { token } = this.props;
    const { _id } = this.props.post;
    event.preventDefault();

    // set loading to true
    this.setState({ loading: true });

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

      // set loading to false
      this.setState({ loading: false });

      // close modal
      this.props.handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading } = this.state;
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

        <div
          style={{
            position: "relative",
            display: "inline-block"
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            disabled={loading}
            onClick={this.handleFormSubmit}
          >
            Delete Post
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12,
                color: "#8b0000"
              }}
            />
          )}
        </div>
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
