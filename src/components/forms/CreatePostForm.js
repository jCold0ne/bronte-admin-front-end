import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
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
    galleryImage: null,
    loading: false
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

  handleFormSubmit = async event => {
    const { title, body, image, galleryImage } = this.state;
    const { token } = this.props;
    event.preventDefault();

    // form validation
    if (!title || !body) {
      return this.setState(state => ({
        error: "Please enter all fields"
      }));
    }

    if (!image && !galleryImage) {
      return this.setState(state => ({
        error: "Please enter all fields"
      }));
    }

    // set loading to true
    this.setState({ loading: true });

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
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log(postImage);
        // receive url and save post/image url to mongodb
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/posts`,
          {
            title,
            body,
            draft: false,
            imageUrl: postImage.data[0].url,
            imageName: postImage.data[0].name,
            imageId: postImage.data[0]._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else if (galleryImage) {
        // if user is selecting preuploaded image from database
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/posts`,
          {
            title,
            body,
            draft: false,
            imageUrl: galleryImage.url,
            imageName: galleryImage.name,
            imageId: galleryImage._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

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
    const { title, body, galleryImage, image, loading, error } = this.state;

    return (
      <form>
        {error && <Alert severity="error">{error}</Alert>}
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
        <div style={{ marginTop: "2rem" }}>
          <TextField
            name="title"
            value={title}
            onChange={this.onInputChange}
            id="standard-basic"
            label="Title"
          />
        </div>
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

        <div style={{ marginBottom: "1rem" }}>
          <ModalWrapper
            text="Select Post Image"
            component={PostImageForm}
            setImage={this.setImage}
            onDrop={this.onDrop}
          />
        </div>

        <div style={{ position: "relative", display: "inline-block" }}>
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

export default connect(mapStateToProps, { fetchPosts, fetchImages })(PostForm);
