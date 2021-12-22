import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useHistory, useParams } from "react-router-dom";

import InputAdornment from "@mui/material/InputAdornment";

import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import AuthContext from "../../shared/context/auth-context";

const validationSchema = yup.object({
  title: yup
    .string("Enter title")
    .min(3, "Enter valid title!")
    .required("Title is required"),
  price: yup
    .number("Enter price")
    .positive("Enter a valid price")
    .required("Price is required"),
  quantity: yup
    .number("Enter quantity")
    .positive("Enter a valid quantity")
    .required("Quantity is required"),
  image: yup
    .string("Enter imageurl")
    .url("Enter a valid imageurl")
    .required("Imageurl is required"),
  production: yup
    .date("Enter production date")

    .required("Production date is required"),

  expire: yup
    .date("Enter expire date")

    .required("Expire date is required"),

  category: yup.string("Choose a Category").required(" Category is required"),
});

const AddProduct = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = React.useState(false);
  const ctxAuth = React.useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();

  let product;

  let width = "60vw";

  if (matches) {
    width = "30vw";
  }

  if (props.edit) {
    product = props.items.find(
      (product) => product._id.toString() === id.toString()
    );
  }

  const formik = useFormik({
    initialValues: {
      title: props.edit && product ? product.title : "",
      price: props.edit && product ? product.price : "",
      quantity: props.edit && product ? product.quantity : "",
      image: props.edit && product ? product.image : "",
      production: props.edit && product ? product.production : "",
      expire: props.edit && product ? product.expire : "",
      category: props.edit && product ? product.category : "",
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      if (props.edit) {
        props.onEditProduct({
          _id: product._id,
          ...values,
        });
        return history.push("/");
      }

      setLoading(true);
      let response;
      try {
        response = await axios.post(
          "http://127.0.0.1:5000/api/products/",
          {
            ...values,
          },
          {
            headers: {
              Authorization: "Bearer " + ctxAuth.token,
            },
          }
        );

        props.onAddProduct(
          {
            ...response.data.result,
          },
          response.data.message
        );
        setLoading(false);
        history.push("/");
      } catch (error) {
        props.onAddProduct(null, null);
        setLoading(false);
        history.push("/");
      }
    },
  });

  if (props.edit && !product) {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "70vh" }}
      >
        <Grid item sx={{ mb: matches && "10vh" }}>
          <lottie-player
            autoplay
            loop
            mode="normal"
            src="https://assets4.lottiefiles.com/packages/lf20_ibd44T.json"
            style={{ height: "25vh", width: "25vw" }}
          />
        </Grid>
        <Grid item sx={{ textAlign: "center", width: "40vw" }}>
          <Typography variant={matches ? "h3" : "h4"} align="center">
            Can't find the product
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh", marginTop: "40px" }}
    >
      <Paper>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 5, width: width },
          }}
          noValidate
          autoComplete="off"
          textAlign="center"
        >
          <Grid item>
            <TextField
              onBlur={formik.handleBlur}
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              name="title"
              label="Title"
              type="text"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              onBlur={formik.handleBlur}
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              name="price"
              label="Price"
              type="number"
              variant="standard"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              onBlur={formik.handleBlur}
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
              name="quantity"
              label="Quantity"
              type="number"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              onBlur={formik.handleBlur}
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
              name="image"
              type="url"
              label="Image"
              variant="standard"
              fullWidth
            />
          </Grid>

          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                dateAdapter={AdapterDateFns}
                name="production"
                value={formik.values.production}
                onChange={(value) => formik.setFieldValue("production", value)}
                label="Production date"
                inputFormat="dd/MMM/yyyy"
                renderInput={(params) => (
                  <TextField
                    id="production"
                    name="production"
                    {...params}
                    onBlur={formik.handleBlur}
                    variant="standard"
                    error={
                      formik.touched.production &&
                      Boolean(formik.errors.production)
                    }
                    helperText={
                      formik.touched.production && formik.errors.production
                    }
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                dateAdapter={AdapterDateFns}
                value={formik.values.expire}
                name="expire"
                onChange={(value) => formik.setFieldValue("expire", value)}
                label="Expiration date"
                inputFormat="dd/MMM/yyyy"
                renderInput={(params) => (
                  <TextField
                    id="expire"
                    name="expire"
                    {...params}
                    onBlur={formik.handleBlur}
                    variant="standard"
                    error={
                      formik.touched.expire && Boolean(formik.errors.expire)
                    }
                    helperText={formik.touched.expire && formik.errors.expire}
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <FormControl
              variant="standard"
              fullWidth
              name="category"
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Choose Category
              </InputLabel>
              <Select
                defaultValue={props.edit && formik.values.category}
                name="category"
                onBlur={formik.handleBlur}
                value={formik.values.category}
                onChange={(e) =>
                  formik.setFieldValue("category", e.target.value)
                }
                label="Choose Category"
              >
                <MenuItem value="vegetables">Vegetables</MenuItem>
                <MenuItem value="fruits">Fruits</MenuItem>
                <MenuItem value="meat">Meat</MenuItem>
                <MenuItem value="bakery">Bakery</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.category && formik.errors.category}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <LoadingButton
              loading={loading}
              size="large"
              variant="contained"
              onClick={formik.handleSubmit}
              type="submit"
            >
              {props.edit ? "Update Product" : "Add Product"}
            </LoadingButton>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

export default AddProduct;
