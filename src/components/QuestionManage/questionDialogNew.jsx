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

function QuestionDialogNew({ isOpen, yes, cancel }) {
  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onBackdropClick={() => cancel()}
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation Message"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to add this question?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancel()}>Cancel</Button>
          <CustomButton onClick={() => yes()} color="primary" autoFocus>
            YES
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default QuestionDialogNew;
