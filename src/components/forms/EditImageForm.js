import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
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
    },
    loading: false
  };

  componentDidMount() {
    // setup category object
    const { category: categories } = this.props.image;
    const defaultCategories = Object.keys(this.state.category);
    const categoryObject = {};
    defaultCategories.forEach(category => {
      if (categories.includes(category)) {
        categoryObject[category] = true;
      } else {
        categoryObject[category] = false;
      }
    });

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
    const { token } = this.props;
    const { _id } = this.props.image;

    event.preventDefault();

    // set loading to true
    this.setState({ loading: true })

    // build categories array
    const categoryArray = [];
    for (let category in categoryObject) {
      if (categoryObject[category]) {
        categoryArray.push(category);
      }
    }

    await axios.put(
      `${process.env.REACT_APP_SERVER_URL}/images/${_id}`,
      {
        caption,
        category: categoryArray
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    this.props.fetchImages();

    // set loading to false
    this.setState({ loading: false })

    this.props.handleClose();
  };

  render() {
    const { caption, category, loading } = this.state;
    const { url } = this.props.image;
    return (
      <div>
        <form>
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
          <div>
            <TextField
              id="standard-basic"
              label="Caption"
              value={caption}
              name="caption"
              onChange={this.handleInputChange}
            />
          </div>
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
          <div style={{ position: "relative", display: "inline-block" }}>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={this.handleFormSubmit}
            >
              Save Image
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
});

export default connect(mapStateToProps, { fetchImages })(
  withStyles(styles)(EditImageForm)
);
