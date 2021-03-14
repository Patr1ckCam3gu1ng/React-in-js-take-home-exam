//npm
import React from "react";

//material-ui
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Paper from "@material-ui/core/Paper";

export default {
  components: () => {
    function NoOptionsMessage(props) {
      return (
        <Typography
          color="textSecondary"
          className={props.selectProps.classes.noOptionsMessage}
          {...props.innerProps}
        >
          {props.children}
        </Typography>
      );
    }

    function inputComponent({ inputRef, ...props }) {
      return <div ref={inputRef} {...props} />;
    }

    function Control(props) {
      return (
        <TextField
          fullWidth
          InputProps={{
            inputComponent,
            inputProps: {
              className: props.selectProps.classes.input,
              inputRef: props.innerRef,
              children: props.children,
              ...props.innerProps
            }
          }}
          {...props.selectProps.textFieldProps}
        />
      );
    }

    function Option(props) {
      return (
        <MenuItem
          buttonRef={props.innerRef}
          selected={props.isFocused}
          component="div"
          style={{
            fontWeight: props.isSelected ? 500 : 400
          }}
          {...props.innerProps}
        >
          {props.children}
        </MenuItem>
      );
    }

    function Placeholder(props) {
      return (
        <Typography
          color="textSecondary"
          className={props.selectProps.classes.placeholder}
          {...props.innerProps}
        >
          {props.children}
        </Typography>
      );
    }

    function SingleValue(props) {
      return (
        <Typography
          className={props.selectProps.classes.singleValue}
          {...props.innerProps}
        >
          {props.children}
        </Typography>
      );
    }

    function ValueContainer(props) {
      return (
        <div className={props.selectProps.classes.valueContainer}>
          {props.children}
        </div>
      );
    }

    function Menu(props) {
      return (
        <Paper
          square
          className={props.selectProps.classes.paper}
          {...props.innerProps}
        >
          {props.children}
        </Paper>
      );
    }

    return {
      NoOptionsMessage,
      inputComponent,
      Control,
      Option,
      Placeholder,
      SingleValue,
      ValueContainer,
      Menu
    };
  }
};
