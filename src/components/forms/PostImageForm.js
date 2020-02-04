import React, { Component } from "react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";

class PostImageForm extends Component {
  selectImage = image => {
    return () => {
      this.props.setImage(image);
      this.props.handleClose();
    };
  };

  handleOnDrop = files => {
    this.props.onDrop(files[0]);
    this.props.handleClose();
  };

  getColor = formState => {
    if (formState.isDragAccept) {
      return "#00e676";
    }
    if (formState.isDragReject) {
      return "#ff1744";
    }
    if (formState.isDragActive) {
      return "#2196f3";
    }
    return "#eeeeee";
  };

  getStyles = formState => {
    return {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      borderWidth: "2px",
      borderRadius: "2px",
      borderColor: this.getColor(formState),
      borderStyle: "dashed",
      backgroundColor: "#fafafa",
      color: "#bdbdbd",
      outline: "none",
      transition: "border 0.24s ease-in-out"
    };
  };

  render() {
    const { images } = this.props;
    return (
      <div>
        <div style={{ marginBottom: "2rem" }}>
          <Dropzone onDrop={this.handleOnDrop} accept="image/*">
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject
            }) => (
              <section>
                <div
                  {...getRootProps({ className: "dropzone" })}
                  style={this.getStyles({
                    isDragActive,
                    isDragAccept,
                    isDragReject
                  })}
                >
                  <input {...getInputProps()} />
                  <p>
                    Drag 'n' drop the post image here, or select from the
                    gallery below
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        <div style={{ overflow: "scroll" }}>
          {images.map((image, index) => {
            return (
              <div
                style={{
                  display: "inline-flex",
                  borderRadius: 2,
                  marginBottom: 8,
                  marginRight: 8,
                  width: 100,
                  height: 100,
                  padding: 4,
                  boxSizing: "border-box",
                  cursor: "pointer"
                }}
                key={image._id}
                onClick={this.selectImage(image)}
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  images: state.images
});

export default connect(mapStateToProps)(PostImageForm);
