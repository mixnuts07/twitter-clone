import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { auth, provider, storage } from "../firebase";
import { updateUserProfile } from "../features/userSlice";

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
import { IconButton, makeStyles, Modal } from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SendIcon from "@mui/icons-material/Send";

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%`,
  };
};
const theme = createTheme();

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: "100vh",
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1581784368651-8916092072cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Auth: React.FC = () => {
  //   const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  // JSのFileオブジェクト
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  //   const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
  //     await auth
  //       .sendPasswordResetEmail(resetEmail)
  //       .then(() => {
  //         setOpenModal(false);
  //         setResetEmail("");
  //       })
  //       .catch((err) => {
  //         alert(err.message);
  //         setResetEmail("");
  //       });
  //   };

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // [0] .. 画像1枚だけ取得！
    //  .. ! は  TS の Non-null assertion operator
    // TSのコンパイラに null または undefined ではありませんよ！と通知する！
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      // 連続して同じファイルを選択するとonChangeは反応しない→動かしたい!!
      e.target.value = "";
    }
  };

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      // firebaseの仕様で同じファイル名のものをアップロードすると前のやつが削除される→ユニークなファイル名を作成
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      // 生成したいランダムな文字数
      const N = 16;
      // randomな16桁の文字
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });

    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
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
              {!isLogin && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="username"
                    label="username"
                    type="username"
                    id="username"
                    autoComplete="current-username"
                    value={username}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setUsername(event.target.value)
                    }
                  />
                  <Box textAlign="center">
                    <IconButton>
                      {/* labelで囲うとクリック時、Fileのダイアログが表示される */}
                      <label>
                        <SupervisorAccountIcon
                          fontSize="large"
                          className={
                            avatarImage
                              ? styles.login_addIconLoaded
                              : styles.login_addIcon
                          }
                        />
                        <input
                          type="file"
                          className={styles.login_hiddenIcon}
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}
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
                disabled={
                  // loginモードとresisterモードで条件を分ける
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6 || !avatarImage
                }
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
                  <span
                    className={styles.login_reset}
                    onClick={() => setOpenModal(true)}
                  >
                    Forgot Password
                  </span>
                </Grid>
                <Grid item>
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
              {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div style={getModalStyle()}>
                  <div className={styles.login_modal}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      type="email"
                      name="email"
                      label="Reset Email"
                      value={resetEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setResetEmail(e.target.value);
                      }}
                    />
                    <IconButton onClick={sendResetEmail}>
                      <SendIcon />
                    </IconButton>
                  </div>
                </div>
              </Modal> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default Auth;
