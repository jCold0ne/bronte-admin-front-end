import React, { Component } from "react";
// import axios from "axios";
import { connect } from "react-redux";
import { fetchPosts } from "./../actions";
// import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
// import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
// import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
// import Link from "@material-ui/core/Link";
import ModalWrapper from "./ModalWrapper";
import CreatePostForm from "./forms/CreatePostForm";
import EditPostForm from "./forms/EditPostForm";

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
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function addEllipses(post) {
  if (post.body.length > 30) return post.body.substring(0, 30) + "...";
}

class Posts extends Component {
  async componentDidMount() {
    try {
      this.props.fetchPosts();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { classes, posts } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />

        <main>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Posts
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Something short and leading about the collection below—its
                contents, the creator, etc. Make it short and sweet, but not too
                short so folks don&apos;t simply skip over it entirely.
              </Typography>

              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <ModalWrapper
                      text="Create Post"
                      component={CreatePostForm}
                    />
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {posts.reverse().map(post => (
                <Grid item key={post._id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/random"
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {post.title}
                      </Typography>
                      <Typography>{addEllipses(post)}</Typography>
                    </CardContent>
                    <CardActions>
                      <ModalWrapper
                        text="Edit"
                        component={() => <EditPostForm post={post} />}
                      />
                      <ModalWrapper text="Delete" component={CreatePostForm} />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

export default connect(mapStateToProps, { fetchPosts })(
  withStyles(classes)(Posts)
);
