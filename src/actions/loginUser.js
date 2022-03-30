import { LOGIN_USER } from "./types";

export const loginUser = (token, isLogged, username) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_USER,
      payload: {
        token,
        isLogged,
        username,
      },
    });
  };
};
