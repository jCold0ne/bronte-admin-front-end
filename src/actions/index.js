import axios from "axios";

export const setAuthToken = token => {
  return {
    type: "SET_AUTH_TOKEN",
    payload: token
  };
};

export const fetchPosts = () => {
  return async (dispatch, getState) => {
    let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`);

    return dispatch({
      type: "SET_POSTS",
      payload: response.data
    });
  };
};

export const fetchImages = () => {
  return async (dispatch, getState) => {
    let response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/images`
    );

    return dispatch({
      type: "SET_IMAGES",
      payload: response.data
    });
  };
};
