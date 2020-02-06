import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fetchImages } from "../../actions";
import Dropzone from "react-dropzone";

const styles = theme => ({
  button: {
    margin: theme.spacing
  },
  input: {
    display: "none"
  },
  formControl: {
    margin: theme.spacing(3)
  }
});

class ImageForm extends Component {
  state = {
    files: [],
    data: [],
    loading: false
  };

  onDrop = files => {
    this.setState(state => ({
      ...state,
      files: [...state.files, ...files],
      data: [
        ...state.data,
        ...files.map(file => ({
          caption: "",
          category: {
            blackandwhite: false,
            portrait: false,
            landscape: false,
            editorial: false
          },
          error: {
            caption: false,
            category: false
          }
        }))
      ]
    }));
  };

  handleInputChange = fileIndex => {
    return event => {
      const { value } = event.target;

      this.setState(state => ({
        ...state,
        data: state.data.map((item, itemIndex) => {
          if (fileIndex === itemIndex) {
            return {
              ...item,
              caption: value
            };
          }

          return item;
        })
      }));
    };
  };

  handleCheckboxChange = (index, category) => {
    return event => {
      this.setState(state => ({
        ...state,
        data: state.data.map((item, itemIndex) => {
          if (itemIndex === index) {
            // update categories here
            return {
              ...item,
              category: {
                ...item.category,
                [category]: !item.category[category]
              }
            };
          }

          return item;
        })
      }));
    };
  };

  removeImage = index => {
    return event => {
      event.preventDefault();

      // remove image object from state
      this.setState(state => ({
        files: state.files.filter((file, fileIndex) => index !== fileIndex),
        data: state.data.filter((item, itemIndex) => index !== itemIndex)
      }));
    };
  };

  handleFormSubmit = async event => {
    const { files, data } = this.state;
    const { token } = this.props;
    event.preventDefault();

    // set loading to true
    this.setState({ loading: true });

    const formData = new FormData();

    files.forEach((file, index) => {
      // build category array here
      const category = [];
      for (let item in data[index].category) {
        if (data[index].category[item]) {
          category.push(item);
        }
      }

      const newData = {
        caption: data[index].caption,
        category
      };

      // build form data here
      formData.append("files", file);
      formData.append(file.name, JSON.stringify(newData));
    });

    // make axios request

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/images`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // update redux state to show new uploads
    this.props.fetchImages();

    // set loading to false
    this.setState({ loading: false });

    // close modal
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
    const { files, data, loading } = this.state;

    return (
      <div style={{ overflow: "scroll" }}>
        <form encType="multipart/form-data">
          <Dropzone onDrop={this.onDrop} accept="image/*">
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
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <div>
                  {files.map((file, index) => (
                    <div style={{ position: "relative" }}>
                      <p>{file.name}</p>
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
                        key={file.name}
                      >
                        <div
                          style={{
                            display: "flex",
                            minWidth: 0,
                            overflow: "hidden"
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{
                              display: "block",
                              width: "auto",
                              height: "100%"
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Caption"
                          onChange={this.handleInputChange(index)}
                          error
                        />
                      </div>
                      <FormControl
                        component="fieldset"
                        className={styles.formControl}
                      >
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data[index].category.blackandwhite}
                                onChange={this.handleCheckboxChange(
                                  index,
                                  "blackandwhite"
                                )}
                                value="blackandwhite"
                              />
                            }
                            label="Black and White"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data[index].category.portrait}
                                onChange={this.handleCheckboxChange(
                                  index,
                                  "portrait"
                                )}
                                value="portrait"
                              />
                            }
                            label="Portrait"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data[index].category.landscape}
                                onChange={this.handleCheckboxChange(
                                  index,
                                  "landscape"
                                )}
                                value="landscape"
                              />
                            }
                            label="Landscape"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data[index].category.editorial}
                                onChange={this.handleCheckboxChange(
                                  index,
                                  "editorial"
                                )}
                                value="editorial"
                              />
                            }
                            label="Editorial"
                          />
                        </FormGroup>
                      </FormControl>

                      <CloseIcon
                        onClick={this.removeImage(index)}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          cursor: "pointer"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </Dropzone>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={this.handleFormSubmit}
            >
              Save Image(s)
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
  withStyles(styles)(ImageForm)
);
