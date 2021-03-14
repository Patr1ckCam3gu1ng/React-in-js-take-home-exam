//npm
import React from "react";
import { Link } from "react-router-dom";

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
}))(({ classes, data, actions, sectionId }) => {
  function openNewTab(questionId) {
    window.open(`${process.env.PUBLIC_URL}/questions/${questionId}`, "_blank");
  }

  if (typeof data.subQuestions === "undefined") {
    return <span />;
  }

  return (
    <Dialog
      open={data.isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onBackdropClick={() => actions.onClose()}
    >
      <DialogTitle id="alert-dialog-title">
        <b style={{ color: "red" }}>{"WARNING"}</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{ color: "black" }}
        >
          Parent Question still has Sub-Questions linked to the same Section:
        </DialogContentText>
        <div style={{ marginTop: "5%" }} />
        <div>
          {typeof data === "undefined" ? (
            <span />
          ) : (
            data.subQuestions.map(prop => {
              return (
                <div key={prop.questionId}>
                  <Link to={"#"} onClick={() => openNewTab(prop.questionId)}>
                    {prop.questionId} |{" "}
                    {prop.questionLabel.substring(0, 65) +
                      (prop.questionLabel.length >= 65 ? "..." : "")}
                  </Link>
                </div>
              );
            })
          )}
        </div>
        <div style={{ marginTop: "5%" }} />
        <DialogContentText
          id="alert-dialog-description"
          style={{ color: "black" }}
        >
          Would you like to proceed and automatically unlink the Sub-Questions
          too?
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => actions.onClose()}
          color="default"
          autoFocus
          variant="outlined"
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          onClick={() => actions.proceed(data.parentQuestionId, sectionId)}
          color="secondary"
          autoFocus
          variant="outlined"
          className={classes.button}
        >
          Yes. Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
});
