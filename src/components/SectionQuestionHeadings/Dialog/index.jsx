//npm
import React from "react";

//material-ui-dialog
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

//material-ui
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";

function SectionQuestionHeadingDialog({
  isOpen,
  selected,
  toggle,
  classes,
  update,
  insert,
  onChange
}) {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="form-dialog-title"
      maxWidth={"sm"}
      fullWidth={true}
      transitionDuration={300}
      onBackdropClick={() => toggle()}
    >
      <DialogTitle id="form-dialog-title">Question Heading</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            id={"label"}
            name={"label"}
            label={"Label"}
            margin="dense"
            fullWidth
            classes={classes.textField}
            style={{
              fontWeight: "bold"
            }}
            multiline
            autoFocus={true}
            type={"text"}
            onChange={e => onChange(e)}
            value={typeof selected === "undefined" ? "" : selected.label}
          />
        </div>
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggle()}>Cancel</Button>
        <Button
          onClick={() => {
            if ((typeof selected.id === "undefined") === true) {
              insert();
            } else {
              update();
            }
          }}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    fontWeight: "bold"
  },
  menu: {
    width: "100%"
  }
}))(SectionQuestionHeadingDialog);
