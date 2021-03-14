//npm
import React from "react";
import classNames from "classnames";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

//internals
import GridContainer from "components/Internals/Grid/GridContainer";
import GridItem from "components/Internals/Grid/GridItem";

//components
import ConfirmRevertDialog from "components/TableQuestions/confirmRevertDialog";
import ConfirmDeleteDialog from "components/TableQuestions/confirmDeleteDialog";

//Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

function Toggle({ classes, actualWidth, actualWidthToggle }) {
  return (
    <FormGroup row>
      <FormControlLabel
        className={classes.toggle}
        control={
          <Switch
            checked={actualWidth}
            onChange={actualWidthToggle}
            value="checkedB"
            color="primary"
          />
        }
        label={
          <div
            style={
              actualWidth
                ? {
                    color: "black"
                  }
                : {
                    color: "#8080805e"
                  }
            }
          >
            Actual Width
          </div>
        }
      />
    </FormGroup>
  );
}

function TableFooter({ classes }) {
  return (
    <Consumer>
      {({ footer }) => {
        return (
          <GridContainer>
            <GridItem md={3} style={{ marginTop: "1%" }}>
              <Toggle classes={classes} {...footer} />
            </GridItem>
            <GridItem md={6} />
            {/*<GridItem md={1} style={{ marginTop: "1%" }} />*/}
            <GridItem md={3} style={{ marginTop: "1%" }}>
              <div className={classes.divMargin}>
                <Button
                  variant="outlined"
                  size="small"
                  color="default"
                  className={classNames(classes.button)}
                  onClick={() => footer.deleteTable()}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="default"
                  className={classNames(classes.button)}
                  onClick={() => footer.cancelChanges()}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classNames(classes.button)}
                  onClick={() => footer.saveChanges()}
                >
                  SAVE
                </Button>
              </div>
            </GridItem>
            <ConfirmRevertDialog {...footer.confirmRevert} />
            <ConfirmDeleteDialog
              {...footer.deleteTableDialog.state}
              cancel={footer.deleteTableDialog.cancel}
              yes={footer.deleteTableDialog.yes}
            />
          </GridContainer>
        );
      }}
    </Consumer>
  );
}

export default withStyles(theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    fontWeight: "bold",
    fontSize: "14px"
  },
  menu: {
    width: "100%"
  },

  button: {
    marginRight: "2%"
  },
  divMargin: {
    marginLeft: "14%"
  },
  toggle: {
    marginLeft: "33%"
  }
}))(TableFooter);
