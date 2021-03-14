//npm
import React from "react";
import _ from "lodash";

//dialog
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

//material-ui
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

function SubQuestionDialog({
  open,
  onClose,
  data,
  onTextChange,
  buttonText,
  responseTypes,
  options,
  onUpdate,
  onInsertNew,
  status
}) {
  function reformat() {
    if (typeof options !== "undefined") {
      let parentOptions = [];

      options.data.map(prop => {
        parentOptions.push({
          id: prop.value,
          value: prop.optionLabel
        });
      });

      return parentOptions;
    }
  }

  function getValue(prop) {
    if (prop.id === "responseType") {
      const value = data["responseTypeId"];

      return typeof value === "undefined" ? -1 : value;
    }
    if (prop.id === "parentOption") {
      const value = data["parentOptionValue"];

      return typeof value === "undefined" ? -1 : value;
    }

    return data[prop.id];
  }

  const fields = [
    {
      id: "order",
      label: "Order",
      isNumber: true
    },
    {
      id: "questionLabel",
      label: "Question Label"
    },
    {
      id: "responseType",
      label: "Response Type",
      selects: _.filter(responseTypes, v => _.indexOf([3, 4, 7], v.id) > -1)
    },
    {
      id: "parentOption",
      label: "Parent Option",
      selects: reformat()
    }
  ];

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      maxWidth={"md"}
      transitionDuration={300}
    >
      <DialogTitle id="form-dialog-title">Sub Question</DialogTitle>
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
                autoFocus={key === 0}
                type={typeof prop.isNumber === "undefined" ? "text" : "number"}
                onChange={e => onTextChange(e.target)}
                name={prop.id}
                value={getValue(prop)}
                select={typeof prop.selects !== "undefined"}
              >
                {typeof prop.selects !== "undefined" ? (
                  prop.selects.map(selectProp => {
                    return (
                      <MenuItem key={selectProp.id} value={selectProp.id}>
                        {selectProp.value}
                      </MenuItem>
                    );
                  })
                ) : (
                  <span />
                )}
              </TextField>
            );
          })}
          <br />
        </div>
      </DialogContent>
      <DialogActions>
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
  );
}

export default SubQuestionDialog;
