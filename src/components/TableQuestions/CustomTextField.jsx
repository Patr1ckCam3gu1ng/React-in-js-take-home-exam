//npm
import classNames from "classnames";
import React from "react";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import IconButton from "@material-ui/core/IconButton/IconButton";
import TextField from "@material-ui/core/TextField/TextField";

//icons
import ExitToApp from "@material-ui/icons/ExitToApp";
import TextFields from "@material-ui/icons/TextFields";

//assets
import questionTableStyle from "assets/jss/TableQuestions";
import _ from "lodash";

function CustomTextField({
  classes,
  id,
  width,
  disabled,
  value,
  name,
  noInputProps,
  onTextChange,
  type,
  row,
  column,
  boldText,
  onToggleClick,
  defaultValue,
  iconButton,
  listDownInputNodes,
  onEditCellSetting
}) {
  const onChangeWithDelay = _.debounce(function(eventTarget) {
    onTextChange(eventTarget);
  }, 700);

  const onClickText = event =>
    typeof onEditCellSetting !== "undefined"
      ? typeof event.target.type !== "undefined"
        ? event.target.type === "text"
          ? iconButton
            ? onEditCellSetting(event.target, row, column)
            : {}
          : {}
        : {}
      : {};

  return (
    <TextField
      onClick={onClickText}
      margin={"dense"}
      id={id}
      name={name + "|" + column}
      className={classNames(classes.margin, classes.textPlain)}
      style={{
        width: width + "%",
        margin: "2px",
        height: "33px",
        fontWeight: boldText ? "bold" : "normal"
      }}
      value={value}
      defaultValue={defaultValue}
      variant="outlined"
      type={typeof type === "undefined" ? "text" : type}
      // type={this.state.showPassword ? 'text' : 'password'}
      onChange={event =>
        name === "width"
          ? onChangeWithDelay(event.target)
          : onTextChange(event.target)
      }
      inputRef={node =>
        typeof listDownInputNodes !== "undefined"
          ? listDownInputNodes(node)
          : {}
      }
      InputProps={
        noInputProps === true
          ? {
              style: {
                paddingRight: "0",
                fontSize: "12px"
              },
              inputProps: {
                min: 1,
                max: 70,
                style: {
                  paddingTop: "10px",
                  paddingBottom: "10px"
                }
              }
            }
          : {
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <IconButton
                    color={"primary"}
                    disabled={disabled}
                    tabIndex="-1"
                    onClick={() => onToggleClick(id, row, column)}
                  >
                    {iconButton ? <ExitToApp /> : <TextFields />}
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                paddingRight: "0",
                fontSize: "12px"
              },
              inputProps: {
                style: {
                  cursor: iconButton ? "pointer" : "",
                  textDecoration: iconButton ? "underline" : "",
                  paddingTop: "10px",
                  paddingBottom: "10px"
                }
              }
            }
      }
    />
  );
}

export default withStyles(questionTableStyle)(CustomTextField);
