import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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
    error: null
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

  onFormSubmit = async event => {
    event.preventDefault();
    const { title, body, droppedImage, galleryImage } = this.state;
    const { _id, imageId } = this.props.post;

    try {
      // upload image to express and s3
      if (droppedImage) {
        // if new image is a dropped image, it must be first saved to db

        // delete image from express and s3
        await axios.delete(
          `${process.env.REACT_APP_SERVER_URL}/images/${imageId}`
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
          formData
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
          }
        );

        console.log(updatedPost);
      }

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
    const { title, body, galleryImage, droppedImage } = this.state;

    return (
      <form>
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
        <ModalWrapper
          text="Select Post Image"
          component={PostImageForm}
          setImage={this.setImage}
          onDrop={this.onDrop}
        />
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={this.onFormSubmit}
        >
          Edit Post
        </Button>
      </form>
    );
  }
}

export default connect(null, { fetchPosts, fetchImages })(EditForm);
