import React, { Component } from "react";
import { uploadFile } from "react-s3";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

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
        url: "",
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
      uploadFile(file, config)
        .then(data => {
          // set url location to correct post in state
          this.setState(state => ({
            images: state.images.map((image, imageIndex) => {
              if (imageIndex === index) {
                return {
                  ...image,
                  url: data.location
                };
              }

              return image;
            })
          }));
        })
        .catch(error => console.log(error));
    };
  };

  handleFormSubmit = async event => {
    const { images } = this.state;
    event.preventDefault();
    // send photos to database
    const data = await axios.post("http://localhost:3000/images", { images });
    console.log(data);
    // update redux state to show new uploads
    // close modal
  };

  render() {
    const { classes } = this.props;
    const { images } = this.state;
    return (
      <div>
        <form>
          {images.map((image, index) => (
            <div>
              <label>Upload image</label>
              <input type="file" onChange={this.handleFileChange(index)} />
              <label>Enter caption</label>
              <input
                type="text"
                value={images[index].caption}
                onChange={this.handleInputChange(index)}
                name="caption"
              />
            </div>
          ))}
          <button onClick={this.handleButtonClick}>Add Image</button>
          <button onClick={this.handleFormSubmit}>Save Image(s)</button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(ImageForm);
