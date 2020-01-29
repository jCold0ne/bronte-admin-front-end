import React, { Component } from "react";
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
        <h1 style={{ color: "#F50057" }}>
          Are you sure you want to delete this post?
        </h1>
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

export default connect(null, { fetchPosts })(DeleteForm);
