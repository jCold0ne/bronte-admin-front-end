import React, { Component, useMemo } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
  },
  formControl: {
    margin: theme.spacing(3)
  }
});

class ImageForm extends Component {
  state = {
    files: [],
    data: []
  };

  onDrop = files => {
    this.setState(state => ({
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
    event.preventDefault();

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

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/images`, formData);

    // update redux state to show new uploads
    this.props.fetchImages();

    // close modal
    this.props.handleClose();
  };

  render() {
    const { files, data } = this.state;
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
                      <div>
                        <label>Caption</label>
                        <input
                          type="text"
                          name="caption"
                          value={data[index].caption}
                          onChange={this.handleInputChange(index)}
                        />
                      </div>
                      <FormControl
                        component="fieldset"
                        className={styles.formControl}
                      >
                        <FormLabel component="legend">
                          Select Categories
                        </FormLabel>
                        <FormGroup>
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
