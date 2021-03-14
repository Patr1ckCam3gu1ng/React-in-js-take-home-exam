import React from "react";

//material-ui
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Button from "@material-ui/core/Button/Button";

//components
import CustomButton from "components/Internals/CustomButtons/Button";

function QuestionDialogIncrement({ isOpen, yes, cancel, message }) {
  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onBackdropClick={() => cancel()}
      >
        <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancel()}>Cancel</Button>
          <CustomButton onClick={() => yes()} color="success" autoFocus>
            OK
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default QuestionDialogIncrement;
