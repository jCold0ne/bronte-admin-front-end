export default (state = {}, action) => {
  switch (action.type) {
    case "SET_AUTH_TOKEN":
      return {
        token: action.payload
      };
    default:
      return state;
  }
};
