import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchPosts } from "../../actions";
import axios from "axios";

class PostForm extends Component {
  state = {
    title: "",
    body: "",
    type: "create",
    error: null
  };

  componentDidMount() {
    const { post } = this.props;

    if (post) {
      this.setState({ title: post.title, body: post.body, type: "edit" });
    }
  }

  onInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onFormSubmit = async event => {
    event.preventDefault();
    const { title, body, type } = this.state;

    if (type === "create") {
      try {
        const response = await axios.post("http://localhost:3000/posts", {
          title,
          body
        });
        await this.props.fetchPosts(response.data);
        this.props.handleClose();
      } catch (error) {}
    } else if (type === "edit") {
      try {
        const { _id } = this.props.post;
        const response = await axios.put(`http://localhost:3000/posts/${_id}`, {
          title,
          body
        });
        await this.props.fetchPosts(response.data);
        this.props.handleClose();
      } catch (error) {}
    }
  };

  render() {
    const { title, body, type } = this.state;

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
        {type === "create" ? (
          <>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={this.onFormSubmit}
            >
              Create Post
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              style={{
                marginLeft: "1rem"
              }}
            >
              Save Draft
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={this.onFormSubmit}
          >
            Edit Post
          </Button>
        )}
      </form>
    );
  }
}

export default connect(null, { fetchPosts })(PostForm);
