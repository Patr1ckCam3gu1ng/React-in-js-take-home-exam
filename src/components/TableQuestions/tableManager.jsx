//npm
import React from "react";

//internals
import GridContainer from "components/Internals/Grid/GridContainer";
import GridItem from "components/Internals/Grid/GridItem";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Divider from "@material-ui/core/Divider/Divider";

//Context API
import { TableQuestionConsumer as Consumer } from "views/TableQuestions";

function InputFields({ classes, data, inputs, onChange }) {
  const fields = [
    {
      id: "questionId",
      label: "Questions",
      colSpan: 6,
      selects: typeof data === "undefined" ? [] : data.questions
    },
    {
      id: "totalRows",
      label: "Total Rows",
      colSpan: 2,
      type: "number"
    },
    {
      id: "totalColumns",
      label: "Total Columns",
      colSpan: 2,
      type: "number"
    },
    {
      id: "hasHeader",
      label: "Has Header Row?",
      colSpan: 2,
      selects: [
        {
          id: true,
          label: "Yes"
        },
        {
          id: false,
          label: "No"
        }
      ]
    }
  ];

  return (
    <GridContainer>
      {fields.map((prop, key) => {
        const isSelect = typeof prop.selects !== "undefined";

        let value = typeof inputs === "undefined" ? "" : inputs[prop.id];

        return (
          <GridItem key={key} md={prop.colSpan}>
            <TextField
              id={prop.id}
              disabled={prop.id === "questionId"}
              name={prop.id}
              label={prop.label}
              placeholder={prop.label}
              select={isSelect}
              className={classes.textField}
              onChange={event => onChange(event.target)}
              type={prop.type}
              required
              maxLength="2"
              InputProps={{ inputProps: { min: 1, max: 15 } }}
              value={typeof value === "undefined" ? "" : value}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="dense"
              // error={checkRequired ? isError : false}
              // helperText={checkRequired ? (isError ? "Required" : null) : false}
            >
              {typeof prop.selects === "undefined" ? (
                <span />
              ) : (
                prop.selects.map(subProp => {
                  return (
                    <MenuItem key={subProp.id} value={subProp.id}>
                      {subProp.label}
                    </MenuItem>
                  );
                })
              )}
            </TextField>
          </GridItem>
        );
      })}
    </GridContainer>
  );
}

function Buttons({ classes, onSave, isHideButtons }) {
  const hideButton = isHideButtons
    ? {
        display: "none"
      }
    : {};

  return (
    <GridContainer>
      <GridItem md={10} />
      <GridItem md={1} style={{ marginTop: "1%" }}>
        <Button
          variant="outlined"
          size="small"
          color="default"
          className={classes.button}
          fullWidth={true}
          style={hideButton}
          // onClick={() => this.actions.handleOpen()}
          // disabled={isNewQuestion}
        >
          Clear
        </Button>
      </GridItem>
      <GridItem md={1} style={{ marginTop: "1%" }}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          fullWidth={true}
          onClick={() => onSave()}
          style={hideButton}
          // disabled={isNewQuestion}
        >
          SAVE
        </Button>
      </GridItem>
    </GridContainer>
  );
}

function TableManager({ classes, isHideButtons }) {
  return (
    <Consumer>
      {({ tableManager }) => {
        return (
          <div>
            <InputFields classes={classes} {...tableManager} />
            <Divider style={{ marginTop: "1%" }} />
            <Buttons
              isHideButtons={isHideButtons}
              classes={classes}
              {...tableManager}
            />
          </div>
        );
      }}
    </Consumer>
  );
}

export default withStyles(theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%",
    fontWeight: "bold",
    fontSize: "14px"
  },
  menu: {
    width: "100%"
  },
  button: {
    float: "right"
  }
}))(TableManager);
