import React, { Component, useMemo } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { fetchImages } from "../../actions";
import Dropzone, { useDropzone } from "react-dropzone";

// const baseStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   padding: "20px",
//   borderWidth: 2,
//   borderRadius: 2,
//   borderColor: "#eeeeee",
//   borderStyle: "dashed",
//   backgroundColor: "#fafafa",
//   color: "#bdbdbd",
//   outline: "none",
//   transition: "border .24s ease-in-out"
// };

// const activeStyle = {
//   borderColor: "#2196f3"
// };

// const acceptStyle = {
//   borderColor: "#00e676"
// };

// const rejectStyle = {
//   borderColor: "#ff1744"
// };

// const {
//   // acceptedFiles,
//   // getRootProps,
//   // getInputProps,
//   isDragActive,
//   isDragAccept,
//   isDragReject
// } = useDropzone({ accept: "image/*" });

// const style = useMemo(
//   () => ({
//     ...baseStyle,
//     ...(isDragActive ? activeStyle : {}),
//     ...(isDragAccept ? acceptStyle : {}),
//     ...(isDragReject ? rejectStyle : {})
//   }),
//   [isDragAccept, isDragActive, isDragReject]
// );

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

class ImageForm extends Component {
  state = {
    files: [],
    captions: []
  };

  onDrop = files => {
    this.setState(state => ({
      files: [...state.files, ...files],
      captions: [
        ...state.captions,
        ...files.map(file => ({
          text: ""
        }))
      ]
    }));
  };

  handleButtonClick = event => {
    event.preventDefault();
    this.setState(state => ({
      images: [
        ...state.images,
        {
          url: "",
          caption: ""
        }
      ]
    }));
  };

  handleInputChange = fileIndex => {
    return event => {
      const { value } = event.target;

      this.setState(state => ({
        ...state,
        captions: state.captions.map((caption, captionIndex) => {
          if (fileIndex === captionIndex) {
            return { text: value };
          }

          return caption;
        })
      }));
    };
  };

  handleFormSubmit = async event => {
    const { images } = this.state;
    event.preventDefault();

    // build up form data
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append(`images`, image.file);
      formData.append(image.name, image.caption);
    });

    // make axios request

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/images`, formData);

    // update redux state to show new uploads
    this.props.fetchImages();

    // close modal
    this.props.handleClose();
  };

  removeImage = index => {
    return event => {
      event.preventDefault();

      // remove image object from state
      this.setState(state => ({
        files: state.files.filter((file, fileIndex) => index !== fileIndex),
        captions: state.captions.filter(
          (caption, captionIndex) => index !== captionIndex
        )
      }));
    };
  };

  render() {
    const { files, captions } = this.state;
    return (
      <div>
        <form encType="multipart/form-data">
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section className="container">
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <div>
                  {files.map((file, index) => (
                    <>
                      <p>{file.name}</p>
                      <input
                        type="text"
                        name="caption"
                        value={captions[index].caption}
                        onChange={this.handleInputChange(index)}
                      />
                      <button onClick={this.removeImage(index)}>
                        Remove image
                      </button>
                    </>
                  ))}
                </div>
              </section>
            )}
          </Dropzone>
          <button onClick={this.handleFormSubmit}>Save Image(s)</button>
        </form>
      </div>
    );
  }
}

export default connect(null, { fetchImages })(withStyles(styles)(ImageForm));
