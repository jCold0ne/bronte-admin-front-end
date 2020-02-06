import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { fetchImages } from "../../actions";
import axios from "axios";

class DeleteImageForm extends Component {
  state = {
    loading: false
  };

  handleFormSubmit = async event => {
    const { token } = this.props;
    const { _id } = this.props.image;
    event.preventDefault();

    // set loading to true
    this.setState({ loading: true });

    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/images/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await this.props.fetchImages();

      // set loading to false
      this.setState({ loading: false });

      this.props.handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading } = this.state;
    const { url, caption } = this.props.image;

    return (
      <form>
        <h1 style={{ color: "#F50057" }}>
          Are you sure you want to delete this image?
        </h1>
        <img src={url} alt={caption} />
        <p>{caption}</p>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={this.handleFormSubmit}
          >
            Delete Image
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

export default connect(mapStateToProps, { fetchImages })(DeleteImageForm);
