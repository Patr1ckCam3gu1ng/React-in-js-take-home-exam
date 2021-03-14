//npm
import _ from "lodash";
import { List } from "immutable";
import React from "react";

//internals
import GridItem from "components/Internals/Grid/GridItem.jsx";

//material
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";

const inputProps = {
  style: {
    fontSize: "14px"
  }
};

export function getValue(values, id, isSelect) {
  let value = _.first(
    _.filter(values.toJS(), { id: id + (isSelect ? "Id" : "") })
  );

  if (typeof value === "undefined") {
    return "";
  }

  value = value.value;

  if (isSelect) {
    if (value === 0) {
      value = -1;
    }
  }

  return value || "";
}

function checkRequiredIfEmpty(value, isRequired) {
  if (typeof value === "number") {
    if (value > -1) {
      return false;
    }

    return isRequired;
  }

  return isRequired ? value === "" : isRequired;
}

function isRequired(isRequired) {
  return typeof isRequired === "undefined" ? false : isRequired;
}

function disableHideLabel(isDisabled, prop, values) {
  if (prop.id === "hideLabel") {
    const val = values.toJS();

    const parentQuestionId = _.first(_.filter(val, { id: "parentQuestionId" }));

    const parentResponseTypeId = _.first(
      _.filter(val, { id: "parentResponseTypeId" })
    );

    if (parentQuestionId.value === null || parentResponseTypeId.value !== 12) {
      isDisabled = true;
    }

    if (typeof prop.ParentOptionResponseTypeId !== "undefined") {
      isDisabled = prop.ParentOptionResponseTypeId !== 12;
    }
  }

  return isDisabled;
}

/**
 * @return {boolean}
 */
function LegacyPdfDisable(prop, values) {
  if (prop.id === "legacyPdfSettings") {
    const responseTypeId = _.first(
      _.filter(values.toJS(), { id: "responseTypeId" })
    ).value;

    if (
      responseTypeId === 0 /*none*/ ||
      responseTypeId === -1 /*none*/ ||
      responseTypeId === 6 /*table*/ ||
      responseTypeId === 12 /*group*/ ||
      responseTypeId === 14 /*scrollable*/
    ) {
      return true;
    }
  }

  return false;
}

export function TextInput({
  prop,
  classes,
  onChange,
  values,
  checkRequired,
  onClick
}) {
  let value = getValue(values, prop.id, false);

  const legacyPdfDisable = LegacyPdfDisable(prop, values);

  const required = isRequired(prop.required);

  const isError = checkRequiredIfEmpty(value, required);

  //If 'New' Questions.
  if (prop.isAnchor && value === "") {
    value = "Click to edit";
  }

  const anchorProps =
    typeof prop.isAnchor === "undefined" || legacyPdfDisable
      ? {}
      : {
          style: {
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "14px"
          }
        };

  const clickEvent =
    typeof prop.isAnchor === "undefined" || legacyPdfDisable
      ? function() {}
      : onClick;

  return (
    <GridItem md={prop.colSpan}>
      <TextField
        className={classes.textField}
        sele
        id={prop.id}
        label={prop.labelText}
        placeholder={prop.labelText}
        name={prop.id}
        onChange={event => onChange(event)}
        onClick={() => clickEvent()}
        value={legacyPdfDisable ? "" : value}
        disabled={
          (prop.readOnlyThis === true
            ? prop.readOnlyThis
            : typeof prop.disabled === "undefined"
            ? false
            : prop.disabled) || legacyPdfDisable
        }
        required={required}
        multiline={typeof prop.textArea !== "undefined"}
        rows={5}
        rowsMax={7}
        fullWidth={true}
        margin="normal"
        type={typeof prop.isNumber === "undefined" ? "text" : "number"}
        inputProps={{ ...inputProps, ...anchorProps }}
        error={checkRequired ? isError : false}
        helperText={checkRequired ? (isError ? "Required" : null) : false}
      />
    </GridItem>
  );
}

export function SelectInput({
  prop,
  classes,
  onChange,
  values,
  checkRequired
}) {
  const value = getValue(values, prop.id, true);

  const required = isRequired(prop.required);

  const isError = checkRequiredIfEmpty(value, required);

  let isDisabled =
    prop.readOnlyThis === true
      ? prop.readOnlyThis
      : List(prop.selects).size === 0;

  isDisabled = disableHideLabel(isDisabled, prop, values);

  return (
    <GridItem md={prop.colSpan}>
      <TextField
        id={prop.id}
        select
        label={prop.labelText}
        className={classes.textField}
        onChange={event => onChange(event)}
        name={prop.id}
        required={required}
        value={value}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          },
          ...inputProps
        }}
        margin="normal"
        disabled={isDisabled}
        error={checkRequired ? isError : false}
        helperText={checkRequired ? (isError ? "Required" : null) : false}
      >
        {prop.selects.map(selectProp => {
          const newValue = selectProp.id === 0 ? -1 : selectProp.id;

          return (
            <MenuItem key={newValue} value={newValue}>
              {selectProp.name}
            </MenuItem>
          );
        })}
      </TextField>
    </GridItem>
  );
}
