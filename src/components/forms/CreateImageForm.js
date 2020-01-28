import React, { Component } from "react";
import { connect } from "react-redux";
import { uploadFile } from "react-s3";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { fetchImages } from "../../actions";

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
  dirName: "photos",
  region: process.env.REACT_APP_S3_BUCKET_REGION,
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY
};

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
    images: [
      {
        file: null,
        caption: ""
      }
    ]
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

  handleInputChange = index => {
    return event => {
      const { name, value } = event.target;
      this.setState(state => ({
        images: state.images.map((image, imageIndex) => {
          if (imageIndex === index) {
            return {
              ...image,
              [name]: value
            };
          }

          return image;
        })
      }));
    };
  };

  handleFileChange = index => {
    return event => {
      const file = event.target.files[0];
      this.setState(state => ({
        images: state.images.map((image, imageIndex) => {
          if (imageIndex === index) {
            return {
              ...image,
              file
            };
          }

          return image;
        })
      }));
    };
  };

  handleFormSubmit = async event => {
    const { images } = this.state;
    event.preventDefault();
    // upload photos to s3
    const promises = images.map(image => uploadFile(image.file, config));

    const data = await Promise.all(promises);

    // send photos to database
    // const data = await axios.post(`${process.env.REACT_APP_SERVER_URL}/images`, { images });
    // console.log(data);
    const morePromises = data.map((image, index) => {
      return axios.post(`${process.env.REACT_APP_SERVER_URL}/images`, {
        url: image.location,
        caption: images[index].caption
      });
    });

    const moreData = await Promise.all(morePromises);

    console.log(moreData);
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
        images: state.images.filter((image, imageIndex) => index !== imageIndex)
      }));
    };
  };

  render() {
    const { images } = this.state;
    return (
      <div>
        <form>
          {images.map((image, index) => (
            <div key={index}>
              <label>Upload image</label>
              <input type="file" onChange={this.handleFileChange(index)} />
              <label>Enter caption</label>
              <input
                type="text"
                value={images[index].caption}
                onChange={this.handleInputChange(index)}
                name="caption"
              />
              <button onClick={this.removeImage(index)}>Remove Image</button>
            </div>
          ))}
          <button onClick={this.handleButtonClick}>Add Image</button>
          <button onClick={this.handleFormSubmit}>Save Image(s)</button>
        </form>
      </div>
    );
  }
}

export default connect(null, { fetchImages })(withStyles(styles)(ImageForm));
