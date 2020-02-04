import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { fetchImages } from "../../actions";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9,
    height: "100%",
    width: "100%"
  },
  formControl: {
    margin: theme.spacing(3)
  }
});

class EditImageForm extends Component {
  state = {
    caption: "",
    category: {
      blackandwhite: false,
      portrait: false,
      landscape: false,
      editorial: false,
      post: false
    }
  };

  componentDidMount() {
    // setup category object
    const { category: categories } = this.props.image;
    const defaultCategories = [
      "blackandwhite",
      "portrait",
      "landscape",
      "editorial",
      "post"
    ];
    const categoryObject = {};
    defaultCategories.forEach(category => {
      if (categories.includes(category)) {
        categoryObject[category] = true;
      } else {
        categoryObject[category] = false;
      }
    });
    console.log(categoryObject);
    this.setState({
      caption: this.props.image.caption,
      category: categoryObject
    });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleCheckboxChange = category => {
    return () => {
      this.setState(state => ({
        ...state,
        category: {
          ...state.category,
          [category]: !state.category[category]
        }
      }));
    };
  };

  handleFormSubmit = async event => {
    const { caption, category: categoryObject } = this.state;
    const { _id } = this.props.image;
    event.preventDefault();

    // build categories array
    const categoryArray = [];
    for (let category in categoryObject) {
      if (categoryObject[category]) {
        categoryArray.push(category);
      }
    }

    await axios.put(`${process.env.REACT_APP_SERVER_URL}/images/${_id}`, {
      caption,
      category: categoryArray
    });

    this.props.fetchImages();

    this.props.handleClose();
  };

  render() {
    const { caption, category } = this.state;
    const { url } = this.props.image;
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <div key={url}>
            <div
              style={{
                display: "inline-flex",
                borderRadius: 2,
                border: "1px solid #eaeaea",
                marginBottom: 8,
                marginRight: 8,
                width: 100,
                height: 100,
                padding: 4,
                boxSizing: "border-box"
              }}
              key={url}
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
          </div>
          <label>Edit caption</label>
          <input
            type="text"
            value={caption}
            name="caption"
            onChange={this.handleInputChange}
          />
          <FormControl component="fieldset" className={styles.formControl}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={category.blackandwhite}
                    onChange={this.handleCheckboxChange("blackandwhite")}
                    value="blackandwhite"
                  />
                }
                label="Black and White"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={category.portrait}
                    onChange={this.handleCheckboxChange("portrait")}
                    value="portrait"
                  />
                }
                label="Portrait"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={category.landscape}
                    onChange={this.handleCheckboxChange("landscape")}
                    value="landscape"
                  />
                }
                label="Landscape"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={category.editorial}
                    onChange={this.handleCheckboxChange("editorial")}
                    value="editorial"
                  />
                }
                label="Editorial"
              />
            </FormGroup>
          </FormControl>
          <button>Edit Image</button>
        </form>
      </div>
    );
  }
}

export default connect(null, { fetchImages })(
  withStyles(styles)(EditImageForm)
);
