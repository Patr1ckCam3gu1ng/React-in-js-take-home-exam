import React from "react";

//material
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";

//icons
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

import VerticalAlignTop from "@material-ui/icons/VerticalAlignTop";
import VerticalAlignBottom from "@material-ui/icons/VerticalAlignBottom";
import Remove from "@material-ui/icons/Remove";

// Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

const columnEntries = [
  "Delete column",
  "Insert new column (to the right)",
  "Insert new column (to the left)"
];

const rowEntries = [
  "Insert new row (above)",
  "Delete row",
  "Insert new row (below)"
];

function MenuList({ classes, onSelect, entries, type }) {
  function ColumnsIcon(index) {
    switch (index) {
      case 0:
        return <UnfoldMore />;
      case 1:
        return <LastPage />;
      case 2:
        return <FirstPage />;
      default:
        return <span />;
    }
  }

  function RowsIcon(index) {
    switch (index) {
      case 0:
        return <VerticalAlignTop />;
      case 1:
        return <Remove />;
      case 2:
        return <VerticalAlignBottom />;
      default:
        return <span />;
    }
  }
  return (
    <div className={classes.root}>
      <List component="nav">
        {entries.map((prop, key) => {
          const icons = type === "column" ? ColumnsIcon(key) : RowsIcon(key);

          return (
            <div key={key} onClick={() => onSelect(key, type)}>
              <ListItem button>
                <ListItemIcon>{icons}</ListItemIcon>
                <ListItemText primary={prop} />
              </ListItem>
              {key < 2 ? <Divider /> : <span />}
            </div>
          );
        })}
      </List>
    </div>
  );
}

function ConfigControlsDialog(classes) {
  return (
    <Consumer>
      {({ configControls }) => {
        const { state } = configControls.column;

        const config = configControls.actions;

        if (typeof state === "undefined") {
          return <span />;
        }

        return (
          <div>
            <Dialog
              open={state.isOpen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              onBackdropClick={() => config.onClose()}
            >
              <DialogTitle id="alert-dialog-title">
                {`Manage ${state.type}`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {state.type === "Column" ? (
                    <MenuList
                      classes={classes}
                      {...config}
                      entries={columnEntries}
                      type={"column"}
                    />
                  ) : (
                    <MenuList
                      classes={classes}
                      {...config}
                      entries={rowEntries}
                      type={"row"}
                    />
                  )}
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </div>
        );
      }}
    </Consumer>
  );
}

export default withStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}))(ConfigControlsDialog);
