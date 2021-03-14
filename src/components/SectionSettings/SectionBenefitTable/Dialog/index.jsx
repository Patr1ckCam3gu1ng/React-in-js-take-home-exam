//npm
import React from "react";
import _ from "lodash";

//material-ui-dialog
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

//material-ui
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";

function SectionBenefitDialog({ isOpen, actions, data, classes }) {
  const fields = [
    {
      id: "benefitId",
      label: "Benefit",
      isRequired: true,
      isSelect: true,
      group: "Benefit",
    },
    {
      id: "acceleratedId",
      label: "Accelerated",
      isSelect: true,
      group: "Accelerated",
    },
    {
      id: "occTypeId",
      label: "Occupation Type",
      isSelect: true,
      group: "OccupationType",
    },
    {
      id: "occClass",
      label: "Occupation Class",
    },
    {
      id: "tpdAddOnId",
      label: "TPD Add-On",
      isSelect: true,
      group: "TpdAddon",
    },
  ];

  if (typeof data === "undefined") {
    return <div />;
  }
  let isInsertNew = data.sectionBenefit.sectionBenefitId === 0;

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="form-dialog-title"
      maxWidth={"xs"}
      transitionDuration={300}
      onBackdropClick={() => actions.onClose()}
    >
      <DialogTitle id="form-dialog-title">Section Benefit</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a benefit setting for this section
        </DialogContentText>
        <div>
          {fields.map((prop, key) => {
            const dropdowns = _.filter(data.selects, {
              group: prop.group,
            });

            let value = "";

            if (data.sectionBenefit !== null) {
              value = data.sectionBenefit[prop.id];
            } else {
              value = "";
            }

            if (prop.isSelect === true && value === null) {
              value = "";
            }

            return (
              <TextField
                key={key}
                id={prop.id}
                label={prop.label}
                margin="dense"
                fullWidth
                classes={classes.textField}
                style={{
                  fontWeight: "bold",
                }}
                autoFocus={key === 0}
                type={typeof prop.isSelect === "undefined" ? "text" : "select"}
                onChange={(e) => actions.onChange(e)}
                name={prop.id}
                value={value}
                select={typeof prop.isSelect !== "undefined"}
              >
                {typeof prop.isSelect !== "undefined" ? (
                  dropdowns.map((selectProp) => {
                    return (
                      <MenuItem key={selectProp.id} value={selectProp.id}>
                        {selectProp.name}
                      </MenuItem>
                    );
                  })
                ) : (
                  <span />
                )}
              </TextField>
            );
          })}
        </div>
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => actions.onClose()}>Cancel</Button>
        <Button
          onClick={() =>
            isInsertNew ? actions.onInsertNew() : actions.onSave()
          }
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    fontWeight: "bold",
  },
  menu: {
    width: "100%",
  },
}))(SectionBenefitDialog);
