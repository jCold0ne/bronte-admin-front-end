import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchPosts } from "../../actions";
import { uploadFile } from "react-s3";
import config from "../../config/react-s3";
import axios from "axios";

class PostForm extends Component {
  state = {
    title: "",
    body: "",
    image: null,
    error: null
  };

  componentDidMount() {
    const { post } = this.props;

    if (post) {
      this.setState({ title: post.title, body: post.body });
    }
  }

  onInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onFormSubmit = async event => {
    event.preventDefault();
    const { title, body, image } = this.state;
    try {
      const data = await uploadFile(image.file, config);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/posts`,
        {
          title,
          body,
          imageUrl: data.location,
          imageName: image.name
        }
      );
      await this.props.fetchPosts(response.data);
      this.props.handleClose();
    } catch (error) {}
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

  render() {
    const { title, body } = this.state;

    return (
      <form>
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
        <Button variant="contained" color="primary" type="button">
          <input type="file" onChange={this.handleFileChange} />
        </Button>

        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={this.onFormSubmit}
          style={{
            marginLeft: "1rem"
          }}
        >
          Upload Gallery Image
        </Button>

        <Button
          variant="contained"
          color="secondary"
          type="button"
          onClick={this.onFormSubmit}
          style={{
            marginLeft: "1rem"
          }}
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

export default connect(null, { fetchPosts })(PostForm);
