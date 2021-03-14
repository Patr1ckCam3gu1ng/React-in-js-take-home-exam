import React from "react";

//material-ui
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Button from "@material-ui/core/Button/Button";

function QuestionNextPrevDialog({ isOpen, yes, no, cancel }) {
  return (
    <div>
      <Dialog
        open={isOpen}
        onBackdropClick={() => cancel()}
        maxWidth={"xs"}
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">{"Unsaved Changes"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to save your changes?
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{ paddingRight: "15px" }}>
          <Button variant="outlined" color="primary" onClick={() => cancel()}>
            Cancel
          </Button>
          <Button variant="outlined" color="primary" onClick={() => no()}>
            No
          </Button>
          <Button
            variant="contained"
            autoFocus
            color="primary"
            onClick={() => yes()}
          >
            Yes
          </Button>
        </DialogActions>
        <hr />
      </Dialog>
    </div>
  );
}
export default QuestionNextPrevDialog;
