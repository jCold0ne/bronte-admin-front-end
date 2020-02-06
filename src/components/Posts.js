import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts } from "./../actions";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ModalWrapper from "./ModalWrapper";
import CreatePostForm from "./forms/CreatePostForm";
import EditPostForm from "./forms/EditPostForm";
import DeletePostForm from "./forms/DeletePostForm";

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
    paddingTop: "56.25%",
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

function addEllipses(post) {
  if (post.body.length > 30) return post.body.substring(0, 30) + "...";
}

class Posts extends Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    try {
      await this.props.fetchPosts();
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { loading } = this.state;
    const { classes, posts } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />

        <main style={{ width: "100%" }}>
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
                    Posts
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
                <Grid container spacing={4}>
                  {posts.reverse().map(post => (
                    <Grid item key={post._id} xs={12} sm={6} md={4}>
                      <Card className={classes.card}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {post.title}
                        </Typography>

                        <CardMedia
                          className={classes.cardMedia}
                          image={post.imageUrl}
                          title="Image title"
                        />

                        <CardContent className={classes.cardContent}>
                          <Typography>{addEllipses(post)}</Typography>
                        </CardContent>

                        <CardActions>
                          <ModalWrapper
                            text="Edit"
                            component={EditPostForm}
                            post={post}
                          />
                          <ModalWrapper
                            text="Delete"
                            component={DeletePostForm}
                            post={post}
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

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

export default connect(mapStateToProps, { fetchPosts })(
  withStyles(classes)(Posts)
);
