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

function ConfirmRevertDialog({ isOpen, yes, cancel }) {
  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onBackdropClick={() => cancel()}
      >
        <DialogTitle id="alert-dialog-title">{"Revert Changes"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              This would clear all of the unsaved changes and revert back to the
              saved version from the database.
            </div>
            <br />
            <div>Are you sure about this?</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancel()}>Cancel</Button>
          <CustomButton onClick={() => yes()} color="danger" autoFocus>
            Yes
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default ConfirmRevertDialog;
