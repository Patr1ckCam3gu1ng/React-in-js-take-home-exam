import React from "react";

//material-ui
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Divider from "@material-ui/core/Divider/Divider";

import { Link } from "react-router-dom";

//common
import commonAction from "common/index";

function DeletionInfoDialog({ data, isOpen, classes, onHideDeleteDialog }) {
  function getQuestionId() {
    return commonAction.getQuestionId();
  }

  function getSectionId() {
    return commonAction.getSectionId();
  }

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"FAILED"}</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{ color: "black" }}
        >
          Cannot delete this option because it is used to trigger a
          Sub-Question:
        </DialogContentText>
        <div style={{ marginTop: "5%" }} />
        <div>
          {typeof data === "undefined" ? (
            <span />
          ) : (
            data.map(prop => {
              return (
                <div key={prop.questionId}>
                  <Link
                    to={{
                      pathname: `${
                        process.env.PUBLIC_URL
                      }/sections/${getSectionId()}/questions/${
                        prop.questionId
                      }`,
                      state: {
                        referer: "parent",
                        parentQuestionId: getQuestionId()
                      }
                    }}
                  >
                    {prop.questionId}
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => onHideDeleteDialog()}
          color="primary"
          autoFocus
          variant="outlined"
          className={classes.button}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OptionsDialog({
  open,
  onClose,
  data,
  onTextChange,
  buttonText,
  onUpdate,
  onInsertNew,
  status,
  classes,
  onDelete,
  dialogDelete,
  onHideDeleteDialog
}) {
  const fields = [
    {
      id: "order",
      label: "Order",
      isNumber: true
    },
    {
      id: "optionLabel",
      label: "Option Label"
    },
    {
      id: "value",
      label: "Value",
      isNumber: true
    }
  ];

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
        maxWidth={"xs"}
        transitionDuration={300}
      >
        <DialogTitle id="form-dialog-title">Options</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter details for this new option.
          </DialogContentText>
          <div>
            {fields.map((prop, key) => {
              return (
                <TextField
                  key={key}
                  id={prop.id}
                  label={prop.label}
                  margin="dense"
                  fullWidth
                  style={{
                    fontWeight: "bold"
                  }}
                  required={true}
                  autoFocus={key === 0}
                  type={
                    typeof prop.isNumber === "undefined" ? "text" : "number"
                  }
                  onChange={e => onTextChange(e.target)}
                  name={prop.id}
                  value={data[prop.id]}
                />
              );
            })}
            <br />
          </div>
        </DialogContent>
        <DialogActions>
          <Tooltip title={"Delete"} placement={"top-end"}>
            <IconButton
              color={"default"}
              style={{
                position: "absolute",
                left: 0,
                marginLeft: "2%"
              }}
              aria-label="Delete"
              onClick={() => onDelete(data)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button
            onClick={() => (status === "edit" ? onUpdate() : onInsertNew())}
            variant="contained"
            color="primary"
          >
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
      <DialogDeletionInfo
        {...dialogDelete}
        onHideDeleteDialog={onHideDeleteDialog}
      />
    </div>
  );
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

const DialogDeletionInfo = withStyles(styles)(DeletionInfoDialog);

export default withStyles(styles)(OptionsDialog);
