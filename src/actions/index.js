import axios from "axios";

export const setAuthToken = (token = null) => {
  sessionStorage.setItem("token", token);
  return {
    type: "SET_AUTH_TOKEN",
    payload: token
  };
};

export const removeAuthToken = () => {
  sessionStorage.removeItem("token");
  return {
    type: "REMOVE_AUTH_TOKEN"
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
