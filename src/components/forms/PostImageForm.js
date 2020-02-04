import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

class PostImageForm extends Component {
  state = {
    url: null
  };

  handleImageClick = url => {
    return () => {
      this.setState({ url });
    };
  };

  selectImage = () => {
    const { url } = this.state;
    this.props.setImageUrl(url);
    this.props.handleClose();
  };

  render() {
    const { url } = this.state;
    const { images } = this.props;
    return (
      <div style={{ overflow: "scroll" }}>
        {images.map((image, index) => {
          return (
            <div
              style={{
                display: "inline-flex",
                borderRadius: 2,
                border: url === image.url ? "1px solid #eaeaea" : "none",
                marginBottom: 8,
                marginRight: 8,
                width: 100,
                height: 100,
                padding: 4,
                boxSizing: "border-box",
                cursor: "pointer"
              }}
              key={image._id}
              onClick={this.handleImageClick(image.url)}
            >
              <div
                style={{
                  display: "flex",
                  minWidth: 0,
                  overflow: "hidden"
                }}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  style={{
                    display: "block",
                    width: "auto",
                    height: "100%"
                  }}
                />
              </div>
            </div>
          );
        })}
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "2rem" }}
          onClick={this.selectImage}
        >
          Select Image
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  images: state.images
});

export default connect(mapStateToProps)(PostImageForm);
