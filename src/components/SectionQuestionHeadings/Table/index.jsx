//npm
import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

//material-ui
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Button from "@material-ui/core/Button/Button";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import LinkOff from "@material-ui/icons/RemoveCircleOutline";

//internals
import tasksStyle from "assets/jss/material-dashboard-react/components/tasksStyle.jsx";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";
import SectionQuestionHeadingDialog from "components/SectionQuestionHeadings/Dialog";
import SectionQuestionConfirmDeleteDialog from "components/SectionQuestionHeadings/ConfirmDialog";

const Controls = withStyles(tasksStyle)(({ classes, perLabel, onDelete }) => {
  return (
    <span onClick={() => onDelete(perLabel)}>
      <Tooltip
        id="unlink"
        title="Delete this Question Heading"
        placement="top"
        classes={{ tooltip: classes.tooltip }}
      >
        <IconButton className={classes.tableActionButton}>
          <LinkOff
            className={classes.tableActionButtonIcon + " " + classes.edit}
            style={{ position: "absolute", color: "red" }}
          />
        </IconButton>
      </Tooltip>
    </span>
  );
});

export default withStyles(theme => ({
  tableRow: {
    width: "1000px"
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  button: {
    margin: "5px",
    float: "right"
  }
}))(function({
  classes,
  data,
  showDialog,
  toggle,
  selected,
  update,
  deleteRecord,
  insert,
  onChange,
  deleteDialog,
  deleteRecordForced,
  confirmDialogToggle
}) {
  const headers = ["Label", ""];

  return (
    <React.Fragment>
      <TableHead>
        <TableRow>
          {headers.map((props, key) => {
            return <CustomTableCell key={key}>{props}</CustomTableCell>;
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((perLabel, key) => {
          return (
            <TableRow
              className={classNames(classes.row, classes.tableRow)}
              key={key}
              hover={true}
            >
              <CustomTableCell>
                <Link to={`#`} onClick={() => toggle(perLabel)}>
                  {perLabel.label}
                </Link>
              </CustomTableCell>
              <CustomTableCell padding={"dense"} style={{ width: "1%" }}>
                <Controls perLabel={perLabel} onDelete={deleteRecord} />
              </CustomTableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <CustomTableCell>
            <Link to={`#`} onClick={() => toggle()}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                className={classes.button}
              >
                Add New
              </Button>
            </Link>
          </CustomTableCell>
          <CustomTableCell />
        </TableRow>
      </TableFooter>
      <SectionQuestionHeadingDialog
        isOpen={showDialog}
        toggle={toggle}
        selected={selected}
        update={update}
        insert={insert}
        onChange={onChange}
      />
      <SectionQuestionConfirmDeleteDialog
        dialog={deleteDialog}
        yes={deleteRecordForced}
        cancel={confirmDialogToggle}
      />
    </React.Fragment>
  );
});
