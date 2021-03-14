//npm
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
import TextField from "@material-ui/core/TextField/TextField";

const inputs = [
  {
    id: "sectionName",
    label: "Section Name"
  },
  {
    id: "displayName",
    label: "Display Name",
    required: true
  },
  {
    id: "sectionOrder",
    label: "Order",
    isNumeric: true,
    required: true
  }
];

function FormSectionDialog({ dialog, actions }) {
  if (typeof dialog.data === "undefined") {
    return <span />;
  }
  return (
    <div>
      <Dialog
        open={dialog.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"sm"}
        fullWidth={true}
        onBackdropClick={() => actions.close()}
      >
        <DialogTitle id="alert-dialog-title">{"Copy Section?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              "Enter details below. The new Section will be linked to the same Questions as the current one. Section Settings will not be copied."
            }
          </DialogContentText>
          {inputs.map((prop, key) => {
            const value = dialog.data[prop.id];

            let isError = false;
            let helperText = "";

            if (typeof dialog.validation !== "undefined") {
              isError = helperText = dialog.validation[prop.id];
            }

            return (
              <TextField
                key={key}
                id={prop.id}
                name={prop.id}
                label={prop.label}
                margin="dense"
                fullWidth
                style={{
                  fontWeight: "bold"
                }}
                value={value}
                type={typeof prop.isNumeric === "undefined" ? "text" : "number"}
                required={typeof prop.required === "undefined" ? false : true}
                onChange={e => actions.onChange(e)}
                error={isError}
                helperText={helperText}
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => actions.close()}>Cancel</Button>
          <CustomButton
            onClick={() => actions.onSave()}
            color="primary"
            autoFocus
            style={{ marginRight: "3%" }}
          >
            SAVE
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default FormSectionDialog;
