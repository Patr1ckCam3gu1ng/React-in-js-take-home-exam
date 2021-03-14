//npm
import React from "react";

//Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

//material
import withStyles from "@material-ui/core/styles/withStyles";

//internals
import GridItem from "components/Internals/Grid/GridItem";

//assets
import questionTableStyle from "assets/jss/TableQuestions";

//my components
import ColumnLabel from "components/TableQuestions/rowLabel";

//my components
import CustomTextField from "components/TableQuestions/CustomTextField";

function PerColumn({
  classes,
  calculateWidth,
  getColumns,
  onTextChange,
  state
}) {
  const columns = getColumns();

  const { data, widths } = state;

  return (
    <React.Fragment>
      <GridItem md={1}>
        <ColumnLabel label={"Header"} />
      </GridItem>
      <GridItem md={11}>
        {columns.map((prop, key) => {
          const id = "body-row0-col" + key + "-header";

          const calcWidth = calculateWidth(widths[key]);

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
            disabled: true,
            name: "header",
            onTextChange: onTextChange,
            boldText: true,
            value: textValue
          };

          return <CustomTextField key={key} {...props} />;
        })}
      </GridItem>
    </React.Fragment>
  );
}

function RowHeader({ classes }) {
  return (
    <Consumer>
      {({ tableManager, tableBody }) => {
        const totalColumns = tableManager.inputs.totalColumns;

        const hasHeader = tableManager.inputs.hasHeader || false;

        return typeof totalColumns === "undefined" || totalColumns === "" ? (
          <span />
        ) : hasHeader ? (
          <PerColumn classes={classes} {...tableBody} />
        ) : (
          <span />
        );
      }}
    </Consumer>
  );
}
export default withStyles(questionTableStyle)(RowHeader);
