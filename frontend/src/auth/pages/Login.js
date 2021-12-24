import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Divider, Button } from "@mui/material";
import { Link, useHistory, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import AuthContext from "../../shared/context/auth-context";

const validationSchema = yup.object({
  email: yup
    .string("Enter email")
    .email("Enter a valid email")
    .required("email is required"),
  password: yup
    .string("Enter password")

    .required("Password is required"),
});
const Login = (props) => {
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  const [loading, setLoading] = React.useState(false);
  const [error, showError] = React.useState({ show: false, message: "" });
  const ctx = React.useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          {
            ...values,
          }
        );
        setLoading(false);
        ctx.handleLogin(
          response.data.user._id,
          response.data.token,
          null,
          response.data.user.admin
        );
        history.replace(from);
      } catch (error) {
        setLoading(false);
        showError({ show: true, message: error.response.data.message });
      }
    },
  });
  const matches = useMediaQuery("(min-width:600px)");
  let width = "60vw";
  if (matches) {
    width = "30vw";
  }
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Paper>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 6, width: width },
          }}
          noValidate
          autoComplete="off"
          textAlign="center"
        >
          {error.show && (
            <Grid item>
              <Alert severity="error">{error.message}</Alert>
            </Grid>
          )}
          <Grid item>
            <TextField
              onBlur={formik.handleBlur}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              label="E-mail"
              type="email"
              name="email"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              onBlur={formik.handleBlur}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              type="password"
              name="password"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item>
            <LoadingButton
              loading={loading}
              size="large"
              variant="contained"
              type="submit"
              onClick={formik.handleSubmit}
            >
              Login
            </LoadingButton>
          </Grid>
          <Divider />
          <Grid item>
            <Button
              loading={false}
              size="large"
              color="success"
              variant="contained"
              component={Link}
              to="/create-account"
              exact
            >
              <Typography sx={{ color: "white" }}>Create Account</Typography>
            </Button>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Login;
