import { LOGIN_USER } from "../actions/types";

const initialState = {
  isLogged: false,
  token: null,
  username: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        token: action.payload.token,
        isLogged: action.payload.isLogged,
        username: action.payload.username,
      };
    default:
      return state;
  }
};
