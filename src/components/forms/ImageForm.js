import React, { Component } from "react";
import AWS from "aws-sdk";
import { uploadFile } from "react-s3";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY,
  region: "ap-southeast-2"
});

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

  handleFileChange = event => {
    const file = event.target.files[0];
    uploadFile(file, config)
      .then(data => console.log(data))
      .catch(error => console.log(error));
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
            <div>
              <label>Upload image</label>
              <input type="file" onChange={this.handleFileChange} />
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
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(ImageForm);
