import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import moment from "moment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Typography, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Orders = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  let width = "80vw";
  if (matches) {
    width = "30vw";
  }
  if (props.loading) {
    return (
      <Grid
        justifyContent="center"
        alignItems="center"
        container
        direction="row"
        sx={{mt:'100px'}}
      >
        <CircularProgress size={50} />
      </Grid>
    );
  }
  if (props.orders.length === 0) {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item sx={{ mb: "50px" }}>
          <lottie-player
            autoplay
            loop
            mode="normal"
            src="https://assets4.lottiefiles.com/packages/lf20_ibd44T.json"
            style={{ height: "25vh", width: "25vw" }}
          />
        </Grid>
        <Grid item sx={{ textAlign: "center", width: "80vw" }}>
          <Typography variant="h3">You don't have orders </Typography>

          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{ mt: "20px" }}
          >
            Home
          </Button>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      {props.orders.map((order, index) => {
        return (
          <Grid item key={order._id}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": {
                  p: 3,
                  mt: index === 0 ? "100px" : "30px",
                  width: width,
                },
              }}
              noValidate
              autoComplete="off"
              textAlign="center"
            >
              <Paper>
                <Stack
                  direction="column"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    {" "}
                    Order Id : {order._id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {" "}
                    Orderd : {moment(order.createdAt).fromNow()}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/order/${order._id}`}
                    variant="outlined"
                  >
                    View
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Orders;
