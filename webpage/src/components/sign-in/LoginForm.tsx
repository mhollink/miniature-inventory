import { Card, FormControl, FormLabel, Link, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FormEvent, useState } from "react";
import Divider from "@mui/material/Divider";
import { Google } from "@mui/icons-material";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";

export const LoginForm = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState(false);

  const { signIn, signInWithGoogle } = useFirebaseAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInError(false);

    if (!validateInputs()) return;
    setSigningIn(true);

    const data = new FormData(event.currentTarget);
    signIn(data.get("email") as string, data.get("password") as string)
      .catch((e) => {
        console.error(e);
        setSignInError(true);
      })
      .finally(() => {
        setSigningIn(false);
      });
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Card
      variant={"outlined"}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <Typography variant={"h5"}>Sign in</Typography>
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            {/*<Link*/}
            {/*  component="button"*/}
            {/*  onClick={() => console.log("Forgot password...")}*/}
            {/*  variant="body2"*/}
            {/*  autoFocus={false}*/}
            {/*  sx={{ alignSelf: "baseline" }}*/}
            {/*>*/}
            {/*  Forgot your password?*/}
            {/*</Link>*/}
          </Box>
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
        {signInError && (
          <Alert variant={"filled"} severity={"error"}>
            The email or password you entered is incorrect.
          </Alert>
        )}
        <LoadingButton
          type="submit"
          fullWidth
          loading={signingIn}
          variant="contained"
          onClick={validateInputs}
        >
          Sign in
        </LoadingButton>
        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <span>
            <Link href="/sign-up" variant="body2" sx={{ alignSelf: "center" }}>
              Sign up
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
    </Card>
  );
};
