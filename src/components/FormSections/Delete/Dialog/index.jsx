//npm
import React from "react";

//material-ui
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

//components
import CustomButton from "components/Internals/CustomButtons/Button";

function SectionDeleteDialog({ isOpen, yes, cancel }) {
  return (
    <div>
      <Dialog open={isOpen} onBackdropClick={() => cancel()}>
        <DialogTitle id="alert-dialog-title">{"Delete Section"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>Are you sure you want to delete this section?</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ marginRight: "5%" }}>
          <Button onClick={() => cancel()}>Cancel</Button>
          <CustomButton onClick={() => yes()} color="danger" autoFocus>
            Yes
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default SectionDeleteDialog;
