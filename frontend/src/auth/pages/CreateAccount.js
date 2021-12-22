import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const validationSchema = yup.object({
  name: yup.string("Enter name").required("Name is required"),
  email: yup
    .string("Enter email")
    .email("Enter a valid email")
    .required("email is required"),
  password: yup
    .string("Enter password")
    .min(6, "Enter more than 6 charachter")
    .required("Password is required"),
});

const CreateAccount = () => {
  const matches = useMediaQuery("(min-width:600px)");
  let width = "60vw";
  if (matches) {
    width = "30vw";
  }
  const [loading, setLoading] = React.useState(false);
  const [error, showError] = React.useState({ show: false, message: "" });
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/users/signup",
          {
            ...values,
          }
        );

        setLoading(false);
        history.push("/login");
      } catch (error) {
        setLoading(false);
        showError({ show: true, message: error.response.data.message });
      }
    },
  });
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
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              type="text"
              name="name"
              variant="standard"
              fullWidth
            />
          </Grid>
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
              onClick={formik.handleSubmit}
            >
              Create Account
            </LoadingButton>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

export default CreateAccount;
