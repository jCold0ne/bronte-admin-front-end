import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchPosts } from "../../actions";
import axios from "axios";

class DeleteForm extends Component {
  state = {
    title: "",
    body: "",
    error: ""
  };

  componentDidMount() {
    const { title, body } = this.props.post;
    this.setState({ title, body });
  }

  onFormSubmit = async event => {
    event.preventDefault();
    const { title, body } = this.state;

    try {
      const { _id } = this.props.post;
      const response = await axios.delete(
        `http://localhost:3000/posts/${_id}`,
        {
          title,
          body
        }
      );
      await this.props.fetchPosts(response.data);
      this.props.handleClose();
    } catch (error) {}
  };

  render() {
    const { title, body } = this.state;

    return (
      <form>
        <TextField
          name="title"
          value={title}
          onChange={this.onInputChange}
          disabled
          id="standard-disabled"
          label="Disabled"
        />
        <TextField
          name="body"
          value={body}
          onChange={this.onInputChange}
          disabled
          id="standard-multiline-full-width-disabled"
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

export default connect(null, { fetchPosts })(DeleteForm);
