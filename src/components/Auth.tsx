import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { auth, provider, storage } from "../firebase";
import styles from "./Auth.module.css";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MailIcon from "@mui/icons-material/Mail";

const theme = createTheme();

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };
  const signUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password);
  };

  const signInGoogle = async () => {
    // API が正しいか確認可能！
    console.log(process.env.REACT_APP_FIREBASE_APIKEY);
    // signInWithPopupにprovider(GoogleAuthProvider)を格納　→  POPUPでGoogleのSignInを表示させる
    await auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLogin ? "Login" : "Resister"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<MailIcon />}
                onClick={
                  isLogin
                    ? async function () {
                        try {
                          await signInEmail();
                        } catch (error: any) {
                          alert(error.message);
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail();
                        } catch (error: any) {
                          alert(error.message);
                        }
                      }
                }
              >
                {isLogin ? "Login" : "Resister"}
              </Button>

              <Grid container>
                <Grid item xs>
                  <span className={styles.login_reset}>Forgot Password</span>
                </Grid>
                <Grid item xs>
                  <span
                    className={styles.login_toggleMode}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Create new Account" : "Back to Login"}
                  </span>
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signInGoogle}
              >
                Sign In With Google
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default Auth;
