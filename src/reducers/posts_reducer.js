export default (state = [], action) => {
  switch (action.type) {
    case "SET_POSTS":
      return action.payload;
    case "GET_POST":
      return;
    default:
      return state;
  }
};
