import * as React from "react";
import { Route } from "react-router-dom";
import Grid from "@mui/material/Grid";
import * as LottiePlayer from "@lottiefiles/lottie-player";
import AuthContext from "../../shared/context/auth-context";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

function RequireAuth({ children, ...rest }) {
  const ctx = React.useContext(AuthContext);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <Route
      {...rest}
      render={({ location }) =>
        ctx.isAdmin ? (
          children
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            {" "}
            <lottie-player
              autoplay
              loop
              mode="normal"
              src="https://assets4.lottiefiles.com/packages/lf20_8kwpOg.json"
              style={{ height: "25vh", width: "25vw" }}
            ></lottie-player>
            <Grid item sx={{ textAlign: "center", width: "40vw", mt: "10px" }}>
              <Typography variant={matches ? "h3" : "h4"} align="center">
                You not authorized
              </Typography>
            </Grid>
          </Grid>
        )
      }
    />
  );
}
export default RequireAuth;
