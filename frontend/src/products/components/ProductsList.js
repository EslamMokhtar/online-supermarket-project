import ProductItem from "./ProductItem";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useStyles from "./styles";
import Zoom from "@mui/material/Zoom";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";

const ProductList = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const matches = useMediaQuery("(min-width:600px)");
  const handleClick = () => {
    setOpen(true);
  };

  if (props.items.length === 0) {
    return (
      <Container className={classes.cardGrid}>
        {!props.loading ? (
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
                No Products
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid
            justifyContent="center"
            alignItems="center"
            container
            direction="row"
          >
            <CircularProgress size={50} />
          </Grid>
        )}
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" className={classes.cardGrid}>
      <Zoom in style={{ transitionDelay: "500ms" }}>
        <Grid container spacing={8}>
          {props.items.map((item) => (
            <ProductItem
              onDelete={props.onDelete}
              key={item._id}
              title={item.title}
              price={item.price}
              quantity={item.quantity}
              image={item.image}
              production={item.production}
              expire={item.expire}
              id={item._id}
              freshness={item.freshness}
              onClick={handleClick}
            />
          ))}
        </Grid>
      </Zoom>
    </Container>
  );
};

export default ProductList;
