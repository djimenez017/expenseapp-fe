import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const LOG_IN_MUTATION = gql`
  mutation LogInMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const theme = createTheme();

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    logInMutation({ variables: { username: username, password: password } });
    setPassword("");
    setUsername("");
  };

  const [logInMutation, { data, loading, error }] = useMutation(
    LOG_IN_MUTATION,
    {
      onCompleted({ login }) {
        if (logInMutation) {
          localStorage.setItem("token", login.token);
        }
      },
    }
  );

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  console.log(data);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Expense Tracker
          </Typography>
          <Typography component="subtitle1" variant="subtitle1">
            Track your expenses
          </Typography>
          <Box
            component="form"
            onSubmit={onSubmitHandler}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="username"
              autoComplete="username"
              onChange={usernameHandler}
              value={username}
              autoFocus
            />
            <TextField
              margin="normal"
              onChange={passwordHandler}
              value={password}
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

// {/* <div>
//   <form onSubmit={onSubmitHandler}>
//     <div className="my-5">
//       <label htmlFor="username">Username</label>
//       <input
//         id="username"
//         onChange={usernameHandler}
//         className={"p-2 w-full"}
//         value={username}
//         required
//       />
//       <label htmlFor="password">Password</label>
//       <input
//         name="password"
//         onChange={passwordHandler}
//         className={"p-2 w-full"}
//         value={password}
//         type="password"
//       />
//       <br /> <br />
//       <Button type="Submit">Log In</Button>
//     </div>
//   </form>
// </div> */}
