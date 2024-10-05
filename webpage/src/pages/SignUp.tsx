import { Helmet } from "react-helmet-async";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FormControl, FormLabel, Link, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";
import { Google } from "@mui/icons-material";
import { FormEvent, useEffect, useState } from "react";
import { useFirebaseAuth } from "../firebase/useFirebaseAuth.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";

export const SignUp = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Sign up",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  const { signUp, signInWithGoogle } = useFirebaseAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInError(false);

    if (!validateInputs()) return;
    setSigningIn(true);

    const data = new FormData(event.currentTarget);
    signUp(
      data.get("email") as string,
      data.get("password") as string,
      data.get("name") as string,
    )
      .then(() => {
        navigate("/collections");
      })
      .catch((e) => {
        console.error(e.code);
        setSignInError(true);
        setSignInErrorMessage(e.message);
      })
      .finally(() => {
        setSigningIn(false);
      });
  };

  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const emailAgain = document.getElementById(
      "email-again",
    ) as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const passwordAgain = document.getElementById(
      "password-again",
    ) as HTMLInputElement;

    let isValid = true;

    if (!name.value || name.value.length < 0) {
      setNameError(true);
      setNameErrorMessage("Please enter your name");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (
      !email.value ||
      !/\S+@\S+\.\S+/.test(email.value) ||
      email.value !== emailAgain.value
    ) {
      setEmailError(true);
      setEmailErrorMessage(
        "Please enter a valid email address and make sure its the same in both fields.",
      );
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (
      !password.value ||
      password.value.length < 6 ||
      password.value !== passwordAgain.value
    ) {
      setPasswordError(true);
      setPasswordErrorMessage(
        "Password must be at least 6 characters long and needs to be the same in both fields.",
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <Helmet title={"Sign up"} />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <Typography variant={"h5"}>Create a new account</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 1,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Display name</FormLabel>
              <TextField
                error={nameError}
                helperText={nameErrorMessage}
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={nameError ? "error" : "primary"}
                sx={{ ariaLabel: "email" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{ ariaLabel: "email" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email-again">Repeat email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email-again"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{ ariaLabel: "email" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password-again">Repeat password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password-again"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            {signInError && (
              <Alert variant={"filled"} severity={"error"}>
                {signInErrorMessage}
              </Alert>
            )}
            <LoadingButton
              type="submit"
              fullWidth
              loading={signingIn}
              variant="contained"
              onClick={validateInputs}
            >
              Create account
            </LoadingButton>
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Already have an account?{" "}
              <span>
                <Link href="/home" variant="body2" sx={{ alignSelf: "center" }}>
                  Log in instead
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <LoadingButton
              type="submit"
              fullWidth
              loading={signingIn}
              variant="outlined"
              onClick={() => signInWithGoogle()}
              startIcon={<Google />}
            >
              Sign in with Google
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};
