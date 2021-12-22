import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import useStyles from "./styles";
import { Button, CardActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProgressBar from "react-bootstrap/ProgressBar";
import Stack from "@mui/material/Stack";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { useContext, useState } from "react";
import CartContext from "../../shared/context/cart-context";
import AuthContext from "../../shared/context/auth-context";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteModal from "./DeleteModal";

const ProductItem = (props) => {
  const prodDate = new Date(props.production);
  const expireDate = new Date(props.expire);
  const today = new Date(new Date());
  const diffTime = Math.abs(expireDate - prodDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffTimeFromTodaySec = Math.abs(today - expireDate);
  const diffTimeFromTodayDays = Math.floor(
    diffTimeFromTodaySec / (1000 * 60 * 60 * 24)
  );
  let freshness;
  freshness = Math.ceil((diffTimeFromTodayDays / diffDays) * 100);
  if (diffDays === 0) {
    freshness = 0;
  }
  const ctx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const addQuantity = () => {
    setQuantity((pre) => pre + 1);
  };
  const subQuantity = () => {
    if (quantity === 1) {
      return;
    }
    setQuantity((pre) => pre - 1);
  };

  const addItem = (item) => {
    ctx.handleZoom();
    setQuantity(1);

    ctx.addToCart({ ...item, quantity: quantity });
  };

  const classes = useStyles();

  let color = "green";
  let discount = ((props.price / 3) * 2).toFixed(2);
  if (freshness < 33.3) {
    color = "red";
    discount = (props.price / 3).toFixed(2);
  }
  if (freshness < 66.66 && freshness > 33.33) {
    color = "yellow";
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseEdit = () => {
    setAnchorEl(null);
  };
  const handleCloseDelete = (id) => {
    setOpenModal(false);
    props.onDelete(id);
  };
  return (
    <Grid item key={props.id} xs={12} sm={6} md={6} lg={4}>
      <Card
        className={classes.card}
        style={{ borderTop: `3px solid ${color}` }}
      >
        {authCtx.isAdmin && (
          <IconButton
            size="small"
            aria-label="account of current user"
            color="inherit"
            sx={{ marginLeft: "auto" }}
          >
            <MoreVertIcon
              id="basic-button"
              aria-controls="basic-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            />

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={handleCloseEdit}
                component={Link}
                to={`/edit-product/${props.id}`}
                exact
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setOpenModal(true);
                  setAnchorEl(null);
                }}
                sx={{ color: "red" }}
              >
                Delete
              </MenuItem>
            </Menu>
          </IconButton>
        )}
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ margin: "auto", mt: !authCtx.isAdmin && "10px" }}
        >
          {props.title}
        </Typography>
        {/* <Link to={`/products/${props.id}`}>
          <CardActionArea> */}
        <CardMedia
          className={classes.cardMedia}
          image={props.image}
          title={props.title}
        />
        {/* </CardActionArea>
        </Link> */}
        <CardContent className={classes.cardContent}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant={freshness < 66.66 ? "subtitle1" : "h6"}
              color="text.secondary"
              style={{
                textDecoration: freshness < 66.66 && "line-through",
                color: freshness < 66.66 && "red",
              }}
            >
              {props.price}$
            </Typography>
            <Typography color="text.secondary" variant="h6">
              {freshness < 66.66 && discount + "$"}
            </Typography>
          </Stack>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            className={classes.freshness}
          >
            Freshness
            <ProgressBar>
              <ProgressBar
                variant="danger"
                now={freshness < 33.33 ? freshness : 33.33}
                key={3}
                animated
                label={`Low`}
              />
              <ProgressBar
                variant="warning"
                now={freshness < 66.66 ? Math.max(0, freshness - 33.33) : 33.33}
                key={2}
                animated
                label={`Medium`}
              />
              <ProgressBar
                variant="success"
                now={Math.max(0, freshness - 66.66)}
                key={1}
                animated
                label={`High`}
              />
            </ProgressBar>
          </Typography>
        </CardContent>
        <CardActions>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ mt: "20px", margin: "auto" }}
          >
            {props.quantity > 0 && (
              <Stack direction="row">
                <Button aria-label="reduce" onClick={subQuantity}>
                  <RemoveIcon fontSize="small" />
                </Button>
                {quantity}
                <Button
                  aria-label="increase"
                  onClick={addQuantity}
                  disabled={props.quantity < 1 || quantity === props.quantity}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </Stack>
            )}
            <Button
              aria-label="increase"
              variant="contained"
              disabled={props.quantity < 1}
              endIcon={props.quantity > 0 && <AddShoppingCartIcon />}
              onClick={
                freshness > 66.66
                  ? addItem.bind(null, props)
                  : addItem.bind(null, {
                      ...props,
                      price: discount,
                      prePrice: props.price,
                    })
              }
            >
              {props.quantity > 0 ? "Add To Cart" : "Unavailable"}
            </Button>
          </Stack>
        </CardActions>
      </Card>
      <DeleteModal
        open={openModal}
        delete={handleCloseDelete.bind(null, props.id)}
        handleClose={() => setOpenModal(false)}
      />
    </Grid>
  );
};

export default ProductItem;
