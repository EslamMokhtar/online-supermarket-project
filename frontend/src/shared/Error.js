import Grid from "@mui/material/Grid";
import * as LottiePlayer from "@lottiefiles/lottie-player";

const Error = () => {
  return (
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
        src="https://assets7.lottiefiles.com/packages/lf20_kjixtysj.json"
       style={{height:'75vh',width:'100vw'}}
      ></lottie-player>
    </Grid>
  );
};

export default Error;
