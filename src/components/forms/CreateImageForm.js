import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import { fetchImages } from "../../actions";

const styles = theme => ({
  button: {
    margin: theme.spacing
  },
  input: {
    display: "none"
  }
});

class ImageForm extends Component {
  state = {
    blackandwhite: false,
    portrait: false,
    landscape: false,
    editorial: false,
    images: [
      {
        file: null,
        name: "",
        caption: ""
      }
    ]
  };

  //Checkbox onclick
  handleChange = event => {
    event.preventDefault();
    const { value } = event.target;
    console.log(value);
    this.setState(state => ({
      [value]: !state[value]
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
      const name = file.name;
      console.log(event.target.files);
      this.setState(state => ({
        images: state.images.map((image, imageIndex) => {
          if (imageIndex === index) {
            return {
              ...image,
              name,
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
    const { value } = event.target;
    event.preventDefault();

    // build up form data
    const formData = new FormData();


    const morePromises = data.map((image, index) => {
      return axios.post(`${process.env.REACT_APP_SERVER_URL}/images`, {
        url: image.location,
        caption: images[index].caption,
        name: images[index].name,
        category: [value]
      });

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
        images: state.images.filter((image, imageIndex) => index !== imageIndex)
      }));
    };
  };

  render() {
    const { images } = this.state;
    return (
      <div>
        <form encType="multipart/form-data">
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

          <FormControlLabel
            control={
              <Checkbox
                checked={this.blackandwhite}
                onChange={this.handleChange}
                value="blackandwhite"
              />
            }
            label={"B&W"}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={this.portrait}
                onChange={this.handleChange}
                value="portrait"
              />
            }
            label={"Portrait"}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={this.landscape}
                onChange={this.handleChange}
                value="landscape"
              />
            }
            label={"Landscape"}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={this.editorial}
                onChange={this.handleChange}
                value="editorial"
              />
            }
            label={"Editorial"}
          />
          <button onClick={this.handleButtonClick}>Add Image</button>
          <button onClick={this.handleFormSubmit}>Save Image(s)</button>
        </form>
      </div>
    );
  }
}

export default connect(null, { fetchImages })(withStyles(styles)(ImageForm));
