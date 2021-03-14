import React from "react";

//material
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

//components
import CustomButton from "components/Internals/CustomButtons/Button";

function ConfirmDeleteDialog({ isOpen, yes, cancel }) {
  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onBackdropClick={() => cancel()}
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>Are you sure you want to delete this Table?</div>
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancel()}>Cancel</Button>
          <CustomButton onClick={() => yes()} color="danger" autoFocus>
            Yes. Delete
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default ConfirmDeleteDialog;
