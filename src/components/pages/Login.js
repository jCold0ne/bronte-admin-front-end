import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { setAuthToken } from "./../../actions";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        WHITEMAGNUM
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: null
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = async event => {
    const { email, password } = this.state;
    const { history, setAuthToken } = this.props;
    event.preventDefault();

    // set error to null to remove previous error message
    this.setState({ error: null });

    try {
      // handle password verification here
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        { email, password }
      );
      // set token in redux store here
      setAuthToken(response.data);
      history.push("/dashboard");
    } catch (error) {
      console.log(error);
      this.setState({ error: "Incorrect credentials" });
    }
  };

  render() {
    const { error } = this.state;
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        {error && <Alert severity="error">{error}</Alert>}
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={this.handleFormSubmit}
          >
            <TextField
              variant="outlined"
              color="secondary"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.handleInputChange}
            />
            <TextField
              variant="outlined"
              color="secondary"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handleInputChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>

        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default connect(null, { setAuthToken })(withStyles(styles)(SignIn));
