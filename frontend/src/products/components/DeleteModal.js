import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import React from "react";

const DeleteModal = (props) => {
  const matches = useMediaQuery("(min-width:1000px)");
  let width = "90vw";

  if (matches) {
    width = "30vw";
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "20px",
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={4}
          sx={{ mt: "30px" }}
        >
          <Typography
            id="modal-modal-title"
            variant={matches ? "h3" : "h4"}
            component="h3"
            sx={{ mb: "20px", textAlign: "center" }}
          >
            Are you sure ?
          </Typography>
          <Stack direction="row" spacing={4}>
            <Button
              size="medium"
              variant="outlined"
              onClick={props.handleClose}
            >
              Close
            </Button>
            <Button
              size="medium"
              variant="contained"
              color="error"
              onClick={props.delete}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
export default DeleteModal;
