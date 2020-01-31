import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { deleteFile, uploadFile } from "react-s3";
import config from "../../config/react-s3";
import { fetchPosts } from "../../actions";
import axios from "axios";

class EditForm extends Component {
  state = {
    title: "",
    body: "",
    imageName: "",
    imageUrl: "",
    error: null
  };

  componentDidMount() {
    const { title, body } = this.props.post;
    this.setState({ title, body });
  }

  onFormSubmit = async event => {
    event.preventDefault();
    const { title, body } = this.state;

    try {
      const { _id, imageName } = this.props.post;
      await deleteFile(imageName, config);
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/posts/${_id}`,
        {
          title,
          body
        }
      );
      await this.props.fetchPosts(response.data);
      this.props.handleClose();
    } catch (error) {}
  };

  onInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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

export default connect(null, { fetchPosts })(EditForm);
