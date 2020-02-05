import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchImages } from "../../actions";
import axios from "axios";

class DeleteImageForm extends Component {
  onFormSubmit = async event => {
    const { token } = this.props;
    const { _id } = this.props.image;
    event.preventDefault();

    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/images/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await this.props.fetchImages();
      this.props.handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { url, caption } = this.props.image;

    return (
      <form>
        <h1 style={{ color: "#F50057" }}>
          Are you sure you want to delete this image?
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
              src={url}
              alt={caption}
              style={{
                display: "block",
                width: "auto",
                height: "100%"
              }}
            />
          </div>
        </div>
        <p>{caption}</p>
        <Button
          variant="contained"
          color="secondary"
          type="button"
          onClick={this.onFormSubmit}
        >
          Delete Image
        </Button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
});

export default connect(mapStateToProps, { fetchImages })(DeleteImageForm);
