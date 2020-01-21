import React, { Component } from "react";
import AWS from "aws-sdk";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import TextField from "@material-ui/core/TextField";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "ap-southeast-2"
});

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
    // Set initial files, type 'local' means this is a file
    // that has already been uploaded to the server (see docs)
    files: [],
    images: [
      {
        url: "",
        caption: ""
      }
    ]
  };

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

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

  render() {
    const { classes } = this.props;
    const { images } = this.state;
    return (
      // <div className="App">
      //   {/* Pass FilePond properties as attributes */}
      //   <TextField id="standard-basic" label="Standard" />
      //   <input
      //     accept="image/*"
      //     className={classes.input}
      //     id="raised-button-file"
      //     multiple
      //     type="file"
      //   />
      //   <label htmlFor="raised-button-file">
      //     <Button raised component="span" className={classes.button}>
      //       Upload
      //     </Button>
      //   </label>
      // </div>
      <div>
        <form action="">
          {images.map((image, index) => (
            <>
              <label>Upload image</label>
              <input type="file" />
              <label>Enter caption</label>
              <input
                type="text"
                value={images[index].caption}
                onChange={this.handleInputChange(index)}
                name="caption"
              />
            </>
          ))}
          <button onClick={this.handleButtonClick}>Add Image</button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(ImageForm);
