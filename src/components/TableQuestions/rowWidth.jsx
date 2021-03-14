//npm
import React from "react";

//internals
import GridItem from "components/Internals/Grid/GridItem";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";

//my components
import ColumnLabel from "components/TableQuestions/rowLabel";
import CustomTextField from "components/TableQuestions/CustomTextField";

//assets
import questionTableStyle from "assets/jss/TableQuestions";

//Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

function totalWidth(widths) {
  let totalValue = 0;

  Object.entries(widths).forEach(([key, value]) => {
    totalValue += parseInt(value, 10);
  });

  const total = totalValue.toFixed(0);

  return (
    <span
      style={
        parseInt(total, 10) === 100 ? { color: "green" } : { color: "red" }
      }
    >
      {total}
    </span>
  );
}

function PerColumn({
  classes,
  calculateWidth,
  getColumns,
  getRows,
  totalColumns,
  onTextChange,
  calculateAdjustedWidth,
  dynamicColumnWidth,
  lastAction,
  state
}) {
  const columnsArr = getColumns();

  const { widths } = state;

  return (
    <React.Fragment>
      <GridItem md={1}>
        <ColumnLabel label={"Width %"} />
      </GridItem>
      <GridItem md={11}>
        {columnsArr.map((prop, key) => {
          const id = "width-col" + key;

          const columnWidth =
            typeof widths[key] === "undefined" ? 10 : widths[key];

          if (lastAction === "tableBodyTextChange") {
            calculateAdjustedWidth(key, id);
          }

          let props = {
            id: id,
            width: calculateWidth(columnWidth),
            defaultValue: columnWidth,
            classes: classes,
            name: "widthOnTextChange",
            noInputProps: true,
            onTextChange: onTextChange,
            type: "number",
            column: key
          };

          //Gets triggered when columnConfig is triggered.
          if (lastAction === "onColumnConfig") {
            props.value = widths[key];
          }

          return <CustomTextField key={key} {...props} />;
        })}
        <span>
          <label
            title={"Total width of all columns"}
            className={classes.widthTotal}
          >
            {totalWidth(widths)}
          </label>
        </span>
      </GridItem>
    </React.Fragment>
  );
}

function RowWidth({ classes }) {
  return (
    <Consumer>
      {({ tableManager, tableBody }) => {
        const totalColumns = tableManager.inputs.totalColumns;

        return typeof totalColumns === "undefined" || totalColumns === "" ? (
          <span />
        ) : (
          <PerColumn
            classes={classes}
            {...tableBody}
            totalColumns={totalColumns}
          />
        );
      }}
    </Consumer>
  );
}

export default withStyles(questionTableStyle)(RowWidth);
