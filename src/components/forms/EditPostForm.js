import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import { fetchPosts, fetchImages } from "../../actions";
import axios from "axios";
import ModalWrapper from "./../ModalWrapper";
import PostImageForm from "./PostImageForm";

class EditForm extends Component {
  state = {
    title: this.props.post.title,
    body: this.props.post.body,
    droppedImage: null,
    galleryImage: {
      imageName: this.props.post.imageName,
      imageUrl: this.props.post.imageUrl,
      imageId: this.props.post.imageId
    },
    updated: false,
    error: null,
    loading: false
  };

  onDrop = file => {
    this.setState({
      galleryImage: null,
      droppedImage: file,
      updated: true
    });
  };

  setImage = galleryImage => {
    const { url, name, _id } = galleryImage;
    this.setState({
      droppedImage: null,
      galleryImage: {
        imageUrl: url,
        imageName: name,
        imageId: _id
      },
      updated: true
    });
  };

  handleFormSubmit = async event => {
    const { title, body, droppedImage, galleryImage } = this.state;
    const { token } = this.props;
    const { _id, imageId } = this.props.post;
    event.preventDefault();

    // form validation
    if (!title || !body) {
      return this.setState(state => ({
        error: "Please enter all fields"
      }));
    }

    if (!droppedImage && !galleryImage) {
      return this.setState(state => ({
        error: "Please enter all fields"
      }));
    }

    // set loading to true
    this.setState({ loading: true });

    try {
      // upload image to express and s3
      if (droppedImage) {
        // if new image is a dropped image, it must be first saved to db

        // delete image from express and s3
        await axios.delete(
          `${process.env.REACT_APP_SERVER_URL}/images/${imageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // build formdata
        const data = {
          caption: "",
          category: ["post"]
        };
        const formData = new FormData();
        formData.append("files", droppedImage);
        formData.append(droppedImage.name, JSON.stringify(data));

        // send image to express to save to s3/db
        const postImage = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // update post in mongodb
        const updatedPost = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/posts/${_id}`,
          {
            title,
            body,
            imageId: postImage.data[0]._id,
            imageName: postImage.data[0].name,
            imageUrl: postImage.data[0].url
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log(updatedPost);
      } else if (galleryImage) {
        // if new image is an existing gallery image, simply update post image data

        // update post in mongodb
        const updatedPost = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/posts/${_id}`,
          {
            title,
            body,
            ...galleryImage
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log(updatedPost);
      }

      // set loading to false
      this.setState({ loading: false });

      // fetch posts/images
      await this.props.fetchPosts();
      await this.props.fetchImages();

      // close modal
      this.props.handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  onInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const {
      title,
      body,
      galleryImage,
      droppedImage,
      loading,
      error
    } = this.state;

    return (
      <form>
        {error && <Alert severity="error">{error}</Alert>}
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
              src={
                galleryImage
                  ? galleryImage.imageUrl
                  : URL.createObjectURL(droppedImage)
              }
              alt={galleryImage ? galleryImage.imageName : droppedImage.name}
              style={{
                display: "block",
                width: "auto",
                height: "100%"
              }}
            />
          </div>
        </div>
        <TextField
          name="title"
          value={title}
          onChange={this.onInputChange}
          id="standard-basic"
          label="Title"
        />
        <TextField
          name="body"
          value={body}
          onChange={this.onInputChange}
          id="standard-multiline-full-width"
          label="Body"
          multiline
          rowsMax="10"
          margin="normal"
          fullWidth
          InputLabelProps={{
            shrink: true
          }}
        />
        <div style={{ marginBottom: "1rem" }}>
          <ModalWrapper
            text="Select Post Image"
            component={PostImageForm}
            setImage={this.setImage}
            onDrop={this.onDrop}
          />
        </div>
        <div
          style={{
            position: "relative",
            display: "inline-block"
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={this.handleFormSubmit}
          >
            Save Post
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

export default connect(mapStateToProps, { fetchPosts, fetchImages })(EditForm);
