//npm
import React from "react";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

function MenuLists(state) {
  if (typeof state === "undefined" || typeof state.values === "undefined") {
    return <span />;
  }

  const values = state.values.map((prop, key) => {
    let menuName = "";

    prop.quickOptions.map(labelProp => {
      menuName += ` ${labelProp.optionLabel} /`;

      return labelProp;
    });

    const value = menuName.substring(0, menuName.length - 2);

    return (
      <MenuItem key={key} value={parseInt(prop.groupId, 10)}>
        {value}
      </MenuItem>
    );
  });

  return values;
}
function OptionsDialogQuickAdd({ state, actions }) {
  const isEmptyState = typeof state === "undefined";

  return (
    <Dialog
      open={isEmptyState ? false : state.isOpen}
      aria-labelledby="form-dialog-title"
      maxWidth={"xs"}
      fullWidth={true}
      transitionDuration={300}
      onBackdropClick={() => actions.onCancelQuickAddDialog()}
    >
      <DialogTitle id="form-dialog-title">Options</DialogTitle>
      <DialogContent>
        <TextField
          id={"quickAdd"}
          name={"quickAdd"}
          label={"Quick Add Options"}
          margin="dense"
          fullWidth
          style={{
            fontWeight: "bold"
          }}
          select={true}
          required={true}
          onChange={e => actions.onValueChange(e)}
          value={
            isEmptyState
              ? ""
              : typeof state.selectedValue === "undefined"
                ? ""
                : state.selectedValue
          }
        >
          {MenuLists(state)}
        </TextField>
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => actions.onCancelQuickAddDialog()}>Cancel</Button>
        <Button
          onClick={() => actions.onAddOption()}
          variant="contained"
          color="primary"
        >
          Add Options
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
}))(OptionsDialogQuickAdd);
