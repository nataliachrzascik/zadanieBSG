import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import { loginUser } from "../../actions/loginUser";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const StyledBox = styled(Box)(() => ({
  marginTop: 100,
}));
const StyledTextField = styled(TextField)(() => ({
  marginBottom: 20,
  width: 250,
}));
const StyledButton = styled(Button)(() => ({
  marginBottom: 20,
  width: 200,
}));
const Container = styled(Paper)(() => ({
  height: 500,
  width: 400,
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

function Splash(props) {
  const navigate = useNavigate();

  const callAPI = () => {
    fetch("https://thebetter.bsgroup.eu/Authorization/SignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Device: {
          PlatformCode: "WEB",
          Name: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => props.loginUser(res.AuthorizationToken.Token, false, null))
      .then((res) => navigate(`/main`));
  };

  const callLoggedAPI = (username, password) => {
    fetch("https://thebetter.bsgroup.eu/Authorization/SignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
        Device: {
          PlatformCode: "WEB",
          Name: "7a6a86e5-356f-4795-8998-305e1b205531",
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Wrong login data !");
      })
      .then((res) =>
        props.loginUser(res.AuthorizationToken.Token, true, res.User.FullName)
      )
      .then((res) => navigate(`/main`))
      .catch((err) => alert(err));
  };

  function callAnonymous() {
    callAPI();
  }

  const validationSchema = yup.object({
    username: yup
      .string("Enter your username")
      .required("Username is required"),
    password: yup
      .string("Enter your password")
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      callLoggedAPI(values.username, values.password);
    },
  });

  return (
    <div className="App">
      <StyledBox>
        <Container>
          <h4>Go Login</h4>

          <form onSubmit={formik.handleSubmit}>
            <StyledTextField
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <StyledTextField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <StyledButton variant="outlined" fullWidth type="submit">
              Submit
            </StyledButton>
          </form>
          <h4>or go anonymous</h4>

          <StyledButton onClick={() => callAnonymous()} variant="outlined">
            Go Anonymous
          </StyledButton>
        </Container>
      </StyledBox>
    </div>
  );
}

export default connect(null, { loginUser })(Splash);
