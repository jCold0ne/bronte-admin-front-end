const defaultState = {
  token: sessionStorage.getItem("token")
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case "SET_AUTH_TOKEN":
      return {
        ...state,
        token: action.payload
      };
    case "REMOVE_AUTH_TOKEN":
      return {
        ...state,
        token: null
      };
    default:
      return state;
  }
};
