//npm
import React from "react";

//internals
import GridItem from "components/Internals/Grid/GridItem";

//assets
import questionTableStyle from "assets/jss/TableQuestions";

//Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";

//icons
import Settings from "@material-ui/icons/Settings";

//my components
import CustomTextField from "components/TableQuestions/CustomTextField";

function RowsArray(rows, hasHeader) {
  const array = [];

  //minus 1 because of the header
  for (let i = 0; i < rows - (hasHeader ? 1 : 0); i++) {
    array.push(i);
  }

  return array;
}

function PerColumn({
  classes,
  calculateWidth,
  getColumns,
  row,
  onTextChange,
  onToggleClick,
  state,
  listDownInputNodes,
  onEditCellSetting,
  onOpen
}) {
  const columns = getColumns();

  const { iconButtons, widths, data, focusId } = state;

  return (
    <React.Fragment>
      <GridItem md={1}>
        <IconButton color="primary" className={classes.div}>
          <Settings onClick={() => onOpen(row, "Row")} />
        </IconButton>
      </GridItem>
      <GridItem md={11}>
        {columns.map((prop, key) => {
          const id = "body-row" + row + "-col" + key;

          const calcWidth = calculateWidth(widths[key]);

          const iconButton =
            typeof iconButtons === "undefined"
              ? false
              : typeof iconButtons[id] === "undefined"
                ? false
                : iconButtons[id];

          const isFocus =
            typeof focusId === "undefined" ? false : focusId[id] || false;

          const dataValue = data.values[id];

          let textValue = "";

          if (typeof dataValue !== "undefined") {
            const { text } = dataValue;

            textValue = typeof text === "undefined" ? "" : text;
          }

          const props = {
            id: id,
            width: calcWidth,
            classes: classes,
            name: "body",
            onTextChange: onTextChange,
            onToggleClick: onToggleClick,
            row: row,
            column: key,
            value: textValue,
            iconButton: iconButton,
            isFocus: isFocus,
            listDownInputNodes: listDownInputNodes,
            onEditCellSetting: onEditCellSetting
          };

          return <CustomTextField key={key} {...props} />;
        })}
      </GridItem>
    </React.Fragment>
  );
}

function RowBody({ classes }) {
  return (
    <Consumer>
      {({ tableManager, tableBody, configControls }) => {
        const totalColumns = tableManager.inputs.totalColumns;

        const hasHeader = tableManager.inputs.hasHeader;

        const { onOpen } = configControls.actions;

        const rows = tableBody.getRows();

        const rowsArr = RowsArray(rows, hasHeader);

        const totalRows = rows;

        const hasColumn =
          typeof totalColumns === "undefined" || totalColumns === "";

        const hasRow = typeof totalRows === "undefined" || totalRows === "";

        return hasColumn || hasRow ? null : (
          <React.Fragment>
            {rowsArr.map((prop, key) => {
              return (
                <PerColumn
                  key={key}
                  classes={classes}
                  {...tableBody}
                  row={prop}
                  onOpen={onOpen}
                />
              );
            })}
          </React.Fragment>
        );
      }}
    </Consumer>
  );
}
export default withStyles(questionTableStyle)(RowBody);
