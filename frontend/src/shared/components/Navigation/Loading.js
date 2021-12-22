import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";

const Loading = () => {
  return (
    <Grid justifyContent="center" alignItems="center" container direction="row">
      <CircularProgress size={50} sx={{ mt: "100px" }} />
    </Grid>
  );
};

export default Loading;
