//npm
import React from "react";

//material-ui
import Divider from "@material-ui/core/Divider/Divider";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";

export default withStyles(theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
}))(({ classes, isOpen, close, message, confirm }) => {
  return (
    <Dialog open={isOpen} onBackdropClick={() => close()} maxWidth={"lg"}>
      <DialogTitle>
        <b style={{ color: "red" }}>{"WARNING"}</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{ color: "black" }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => close()}
          color="default"
          autoFocus
          variant="outlined"
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          onClick={() => confirm()}
          color="secondary"
          autoFocus
          variant="outlined"
          className={classes.button}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
});
