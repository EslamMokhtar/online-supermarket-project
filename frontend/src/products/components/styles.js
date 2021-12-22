import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    padding: "120px 50px",
  },
  card: {
    
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingBottom:"15px"
  },
  cardMedia: {
    "&:hover": {
      opacity: 0.6
    },
    paddingTop: "56.25%",

  },
  cardContent: {
    flexGrow: 1,
  },
  freshness: {
    padding: "10px 0px 0px",
  },


}));

export default useStyles;
