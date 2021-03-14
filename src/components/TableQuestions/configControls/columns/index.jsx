//npm
import React, { PureComponent } from "react";
import classNames from "classnames";

//internals
import GridItem from "components/Internals/Grid/GridItem";

//material-ui
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Settings from "@material-ui/icons/Settings";

// Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

//actions
import { actions } from "components/TableQuestions/configControls/columns/actions";

class ConfigColumn extends PureComponent {
  render() {
    return (
      <Consumer>
        {({ tableManager, configControls }) => {
          const { classes } = this.props;

          const columns = tableManager.inputs.totalColumns;

          const columnArr = actions.internals.calculateColumns(columns);

          const width = actions.internals.calculateWidth(columns);

          const config = configControls.actions;

          return (
            <React.Fragment>
              <GridItem md={1} />
              <GridItem md={11}>
                {columnArr.map((column, key) => {
                  return (
                    <React.Fragment key={key}>
                      <div
                        style={{
                          width: width + "%"
                        }}
                        className={classes.div}
                      >
                        <IconButton color="primary" className={classes.button}>
                          <Settings onClick={() => config.onOpen(column, "Column")} />
                        </IconButton>
                      </div>
                      <div
                        className={classNames(classes.separator, classes.div)}
                      />
                    </React.Fragment>
                  );
                })}
              </GridItem>
            </React.Fragment>
          );
        }}
      </Consumer>
    );
  }
}

export default withStyles(() => ({
  button: {
    float: "right",
    padding: "3px"
  },
  div: {
    display: "inline-block",
    float: "left",
    paddingBottom: "3px"
  },
  separator: {
    margin: "2px"
  }
}))(ConfigColumn);
