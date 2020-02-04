import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchPosts, fetchImages } from "../../actions";
import axios from "axios";
import ModalWrapper from "./../ModalWrapper";
import PostImageForm from "./../forms/PostImageForm";

class PostForm extends Component {
  state = {
    title: "",
    body: "",
    image: null,
    error: null,
    galleryImage: null
  };

  componentDidMount() {
    const { post } = this.props;

    if (post) {
      this.setState({ title: post.title, body: post.body });
    }
  }

  onDrop = file => {
    this.setState({
      galleryImage: null,
      image: file
    });
  };

  onInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onFormSubmit = async event => {
    event.preventDefault();
    const { title, body, image, galleryImage } = this.state;
    try {
      if (image) {
        // if new image must be uploaded to s3 for blog post

        // build formdata
        const data = {
          caption: "",
          category: ["post"]
        };
        const formData = new FormData();
        formData.append("files", image);
        formData.append(image.name, JSON.stringify(data));

        // send image to express to save to s3/db
        const postImage = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/images`,
          formData
        );

        // receive url and save post/image url to mongodb
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, {
          title,
          body,
          draft: false,
          imageUrl: postImage.data[0].url,
          imageName: postImage.data[0].name,
          imageId: postImage.data[0]._id
        });
      } else if (galleryImage) {
        // if user is selecting preuploaded image from database
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, {
          title,
          body,
          draft: false,
          imageUrl: galleryImage.url,
          imageName: galleryImage.name,
          imageId: galleryImage._id
        });
      }

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

  handleFileChange = event => {
    const file = event.target.files[0];
    const name = file.name;
    console.log(event.target.files);
    this.setState({
      image: {
        file,
        name
      }
    });
  };

  setImage = galleryImage => {
    this.setState({ image: null, galleryImage });
  };

  render() {
    const { title, body, galleryImage, image } = this.state;

    return (
      <form>
        {(galleryImage || image) && (
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
                src={image ? URL.createObjectURL(image) : galleryImage.url}
                alt="Preview"
                style={{
                  display: "block",
                  width: "auto",
                  height: "100%"
                }}
              />
            </div>
          </div>
        )}

        <TextField
          name="title"
          value={title}
          onChange={this.onInputChange}
          id="standard-basic"
          label="Title"
        />
        <TextField
          name="body"
          id="standard-multiline-full-width"
          label="Body"
          multiline
          rowsMax="10"
          value={body}
          onChange={this.onInputChange}
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
          color="secondary"
          type="button"
          onClick={this.onFormSubmit}
        >
          Save Draft
        </Button>

        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={this.onFormSubmit}
          style={{
            display: "block",
            marginTop: "1rem"
          }}
        >
          Create Post
        </Button>
      </form>
    );
  }
}

export default connect(null, { fetchPosts, fetchImages })(PostForm);
