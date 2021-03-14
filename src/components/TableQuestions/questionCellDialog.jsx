//npm
import React from "react";
import _ from "lodash";

//material-ui
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

//Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

const fields = [
  {
    id: "responseType",
    labelText: "Response Type",
    isNumber: false,
    isSelect: true,
    groupId: 1
  },
  {
    id: "quickAddGroup",
    labelText: "Quick Add Options",
    isNumber: false,
    isSelect: true,
    groupId: 3
  },
  {
    id: "requiredType",
    labelText: "Required Type",
    isNumber: false,
    isSelect: true,
    groupId: 2
  }
];

function MenuLists(cellSettings, prop, quickAdd) {
  if (prop.id === "quickAddGroup") {
    if (typeof quickAdd === "undefined") {
      return <span />;
    }

    const values = quickAdd.values.map((prop, key) => {
      let menuName = "";

      prop.labels.map(labelProp => {
        menuName += ` ${labelProp.label} /`;

        return labelProp;
      });

      const value = menuName.substring(0, menuName.length - 2);

      return (
        <MenuItem key={key} value={prop.groupId}>
          {value}
        </MenuItem>
      );
    });

    return values;
  }

  const values = _.filter(cellSettings.toJS(), {
    groupId: prop.groupId
  }).map((subProp, subKey) => {
    return (
      <MenuItem key={subKey} value={subProp.id}>
        {subProp.name}
      </MenuItem>
    );
  });

  return values;
}

function QuestionCellDialog() {
  return (
    <Consumer>
      {({ cellDialog }) => {
        const { onClose, state, onTextChange, onSave } = cellDialog;

        const {
          isOpen,
          inputs,
          cellSettings,
          isIconCellSetting,
          quickAdd
        } = state;

        if (isOpen === false) {
          return <div />;
        }

        return (
          <Dialog
            open={isOpen}
            aria-labelledby="form-dialog-title"
            maxWidth={"xs"}
            fullWidth={true}
            transitionDuration={300}
            onBackdropClick={() => onClose(isIconCellSetting)}
          >
            <DialogTitle id="form-dialog-title">Question Cell</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter initial settings for this Question.
              </DialogContentText>

              {fields.map(prop => {
                let value = "";

                if (typeof inputs !== "undefined") {
                  const stateData = inputs[prop.id];

                  if (typeof stateData !== "undefined") {
                    value = stateData;
                  }
                }

                // //Quick Add Options
                if (
                  prop.groupId === 3 ||
                  prop.groupId === 4 ||
                  prop.groupId === 7
                ) {
                  if (_.isEmpty(quickAdd)) {
                    return <span />;
                  }
                }

                return (
                  <TextField
                    key={prop.id}
                    id={prop.id}
                    name={prop.id}
                    label={prop.labelText}
                    margin="dense"
                    fullWidth
                    style={{
                      fontWeight: "bold"
                    }}
                    type={prop.isNumber ? "number" : "text"}
                    onChange={e => onTextChange(e)}
                    value={value}
                    select={typeof prop.isSelect !== "undefined"}
                    required={true}
                    InputProps={
                      prop.isNumber ? { inputProps: { min: 1, max: 250 } } : {}
                    }
                  >
                    {MenuLists(cellSettings, prop, quickAdd)}
                  </TextField>
                );
              })}

              <br />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onClose(isIconCellSetting)}>Cancel</Button>
              <Button
                onClick={() => onSave()}
                variant="contained"
                color="primary"
              >
                Done
              </Button>
            </DialogActions>
          </Dialog>
        );
      }}
    </Consumer>
  );
}

export default QuestionCellDialog;
