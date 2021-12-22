import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import moment from "moment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Typography, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { CircularProgress } from "@mui/material";

const Order = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  let width = "80vw";
  if (matches) {
    width = "30vw";
  }
  const { oid } = useParams();

  const order = props.orders.find((order) => order._id === oid);
  if (props.loading) {
    return (
      <Grid
        justifyContent="center"
        alignItems="center"
        container
        direction="row"
        sx={{ mt: "100px" }}
      >
        <CircularProgress size={50} />
      </Grid>
    );
  }
  if (!order) {
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
          <Typography variant="h3">Can't find order </Typography>

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
      <Grid item>
        <Box
          component="form"
          sx={{
            "& > :not(style)": {
              p: 3,
              mt: "100px",
              width: width,
            },
          }}
          noValidate
          autoComplete="off"
          textAlign="center"
        >
          <Paper>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h3"
              sx={{ mb: "20px" }}
            >
              Order Id : {order._id}
            </Typography>
            <Typography variant="body1" sx={{ color: "gray", mb: "10px" }}>
              {moment(order.createdAt).format("LLLL")}
            </Typography>
            <Typography variant="body1" sx={{ color: "gray", mb: "10px" }}>
              Created by : {order.creator.email}
            </Typography>
            <TableContainer>
              <Table aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography>Product</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="left">Quantity</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>Total Price</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar src={row.image} />
                          <Typography>{row.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography>x {row.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>
                          ${(row.price * row.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Divider fullwidth sx={{ mt: "40px", mb: "20px" }} />
              <Typography variant="h5">
                Total: ${order.total.toFixed(2)}
              </Typography>
            </TableContainer>
          </Paper>
        </Box>
      </Grid>
      <Button
        component={Link}
        to="/orders"
        variant="outlined"
        sx={{ mt: "50px" }}
      >
        Back
      </Button>
    </Grid>
  );
};

export default Order;
