import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import React from "react";

//components
import CustomButton from "components/Internals/CustomButtons/Button";

function QuestionCellConfirmDialog({
  isOpen,
  yes,
  cancel,
  isCellSetting,
  id,
  row,
  column
}) {
  const type = isCellSetting ? "question" : "plain text";

  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // onBackdropClick={() => cancel()}
      >
        <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              {`You are about to change this cell's type to ${type}.
                The existing\n configuration will be lost.`}
            </div>
            <br />
            <div>Do you want to continue?</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancel(id)}>Cancel</Button>
          <CustomButton
            onClick={() => yes(id, row, column)}
            color="danger"
            autoFocus
          >
            Yes
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default QuestionCellConfirmDialog;
