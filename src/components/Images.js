import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import ModalWrapper from "./ModalWrapper";
import CircularProgress from "@material-ui/core/CircularProgress";
import CreateImageForm from "./forms/CreateImageForm";
import EditImageForm from "./forms/EditImageForm";
import DeleteImageForm from "./forms/DeleteImageForm";
import { fetchImages } from "./../actions";

const classes = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9,
    height: "100%",
    width: "100%"
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
});

class Images extends Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    try {
      await this.props.fetchImages();
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { loading } = this.state;
    const { images } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />

        <main>
          {/* Hero unit */}
          {loading ? (
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%"
              }}
            />
          ) : (
            <>
              <div className={classes.heroContent}>
                <Container maxWidth="sm">
                  <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                  >
                    Images
                  </Typography>
                  <div className={classes.heroButtons}>
                    <Grid container spacing={2} justify="center">
                      <Grid item>
                        <ModalWrapper
                          text="Create Image"
                          component={CreateImageForm}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </Container>
              </div>
              <Container className={classes.cardGrid} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={4}>
                  {images.reverse().map(image => (
                    <Grid item key={image._id} xs={12} sm={6} md={4}>
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.cardMedia}
                          src={image.url}
                          component="img"
                          title="Image title"
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography>{image.caption}</Typography>
                        </CardContent>
                        <CardActions>
                          <ModalWrapper
                            text="Edit"
                            component={EditImageForm}
                            image={image}
                          />
                          <ModalWrapper
                            text="Delete"
                            component={DeleteImageForm}
                            image={image}
                          />
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </>
          )}
        </main>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  images: state.images
});

export default connect(mapStateToProps, { fetchImages })(
  withStyles(classes)(Images)
);
