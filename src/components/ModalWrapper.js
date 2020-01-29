import React, { Component } from "react";
<<<<<<< HEAD
import { makeStyles, withStyles } from "@material-ui/core/styles";
=======
import { withStyles } from "@material-ui/core/styles";
>>>>>>> origin/master
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const classes = theme => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: "auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
});

class ModalWrapper extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    //on close save post to draft
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const { component: Component, text, classes, ...other } = this.props;

    return (
      <div>
        <Button
<<<<<<< HEAD
          variant={text === "Delete" ? "outlined" : "contained"}
          color={text === "Delete" ? "secondary" : "primary"}
=======
          variant="contained"
          color="primary"
>>>>>>> origin/master
          onClick={this.handleOpen}
          type="button"
        >
          {text}
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={this.handleClose}
          disableBackdropClick
        >
          <div className={classes.paper}>
            <IconButton
              aria-label="delete"
              className={classes.margin}
              onClick={this.handleClose}
              style={{
                position: "absolute",
                top: "0px",
                right: "0px"
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <Component handleClose={this.handleClose} {...other} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(classes)(ModalWrapper);
