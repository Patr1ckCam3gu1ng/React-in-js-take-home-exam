import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";

//material-ui
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import Divider from "@material-ui/core/Divider/Divider";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";

//components
import CustomButton from "components/Internals/CustomButtons/Button";

//internals grids
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

const inputFields = [
  [
    {
      id: "providerName",
      labelText: "Provider",
      colSpan: 4,
      required: true,
      disabled: true
    },
    {
      id: "formName",
      labelText: "Form",
      colSpan: 4,
      required: true,
      disabled: true
    },
    {
      id: "versionNumber",
      labelText: "Form Version",
      colSpan: 4,
      required: true,
      disabled: true
    }
  ],

  [
    {
      id: "benefitId",
      labelText: "Benefit",
      colSpan: 4,
      required: true,
      type: "select",
      group: "Benefits"
    },
    {
      id: "coverMax",
      labelText: "Maximum Cover",
      colSpan: 4
    },
    {
      id: "statusId",
      labelText: "Status",
      colSpan: 4,
      required: true,
      type: "select",
      group: "Status"
    }
  ],

  [
    {
      id: "ageMin",
      labelText: "Minimum Age",
      colSpan: 4,
      numeric: true
    },
    {
      id: "ageMax",
      labelText: "Maximum Age",
      colSpan: 4,
      numeric: true
    },
    {
      id: "includingChildren",
      labelText: "Including Children?",
      colSpan: 4,
      type: "select",
      group: "IncludingChildren"
    }
  ],

  [
    {
      id: "occType",
      labelText: "Occupation Type",
      colSpan: 4,
      type: "select",
      group: "OccupationType"
    },
    {
      id: "occClassMin",
      labelText: "Minimum Occ Class",
      colSpan: 4,
      numeric: true
    },
    {
      id: "occClassMax",
      labelText: "Maximum Occ Class",
      colSpan: 4,
      numeric: true
    }
  ]
];

function checkRequiredIfEmpty(value, isRequired) {
  return isRequired ? value === null : isRequired;
}

function SelectInput({
  prop,
  classes,
  selects,
  value,
  onTextChange,
  checkRequired
}) {
  const inputProps = {
    style: {
      fontSize: "14px"
    }
  };

  const required = isRequired(prop.required);

  const isError = checkRequiredIfEmpty(value, required);

  return (
    <GridItem md={prop.colSpan}>
      <TextField
        id={prop.id}
        select
        label={prop.labelText}
        className={classes.textField}
        onChange={event => onTextChange(event)}
        name={prop.id}
        required={isRequired(prop.required)}
        value={typeof value === "undefined" || value === null ? "" : value}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          },
          ...inputProps
        }}
        margin="normal"
        error={checkRequired ? isError : false}
        helperText={checkRequired ? (isError ? "Required" : null) : false}
      >
        {_.filter(selects, { group: prop.group }).map(selectProp => {
          // const newValue = selectProp.id === 0 ? -1 : selectProp.id;

          return (
            <MenuItem key={selectProp.id} value={selectProp.id}>
              {selectProp.name}
            </MenuItem>
          );
        })}
      </TextField>
    </GridItem>
  );
}

function TextInput({ prop, classes, value, onTextChange }) {
  return (
    <GridItem md={prop.colSpan}>
      <TextField
        id={prop.id}
        label={prop.labelText}
        className={classes.textField}
        placeholder={prop.labelText}
        onChange={event => onTextChange(event)}
        name={prop.id}
        required={isRequired(prop.required)}
        value={value}
        disabled={typeof prop.disabled !== "undefined"}
        type={typeof prop.numeric === "undefined" ? "text" : "number"}
        margin="normal"
      />
    </GridItem>
  );
}

function isRequired(isRequired) {
  return typeof isRequired === "undefined" ? false : isRequired;
}

function HeaderTitle({ classes, text, onClick }) {
  return (
    <p className={classes.cardCategoryWhite}>
      {"Forms > "}
      <Link
        className={classes.linkTo}
        to={`${process.env.PUBLIC_URL}/forms/${text["formId"]}`}
        onClick={() => onClick()}
      >
        {text["formName"]}
      </Link>{" "}
      > Form Versions >{" "}
      <Link
        className={classes.linkTo}
        to={`${process.env.PUBLIC_URL}/forms/${text["formId"]}/formversions/${
          text.formVersionId
        }`}
        onClick={() => onClick()}
      >
        {text.versionNumber}
      </Link>
      {" > Form Benefits > "}{" "}
      <span style={{ color: "grey", fontWeight: "lighter" }}>
        {text.benefitName}
      </span>
    </p>
  );
}

function FormBenefitManageDialog({
  isOpen,
  save,
  cancel,
  classes,
  dialog,
  deleteForm,
  handleOnChange
}) {
  if (typeof dialog === "undefined") {
    return <span />;
  }

  const data = dialog.data.toJS();

  const selects = dialog.selects.toJS();

  const type = dialog.type;

  const checkRequired = dialog.checkRequired;

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={isOpen}
        onBackdropClick={() => cancel()}
      >
        <DialogTitle className={classes.title}>
          <span>
            {type === "update"
              ? data["benefitName"]
              : "Create New Form Benefit"}
          </span>
          <HeaderTitle classes={classes} text={data} onClick={cancel} />
        </DialogTitle>
        <Divider light={true} style={{ marginTop: "0.5%" }} />
        <DialogContent>
          <DialogContentText className={classes.DialogContentText}>
            {inputFields.map((props, keys) => {
              return (
                <GridContainer key={keys}>
                  {props.map((propColumn, key) => {
                    const value = data[propColumn.id];

                    return typeof propColumn.type === "undefined" ? (
                      <TextInput
                        key={key}
                        prop={propColumn}
                        classes={classes}
                        value={value}
                        onTextChange={handleOnChange}
                        checkRequired={checkRequired}
                      />
                    ) : (
                      <SelectInput
                        key={key}
                        prop={propColumn}
                        classes={classes}
                        selects={selects}
                        value={value}
                        onTextChange={handleOnChange}
                      />
                    );
                  })}
                </GridContainer>
              );
            })}
          </DialogContentText>
        </DialogContent>
        <Divider light={true} style={{ marginTop: "1%" }} />
        <DialogActions className={classes.DialogActions}>
          <GridItem md={2}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.deleteButton}
              onClick={() => deleteForm()}
            >
              Delete Form
            </Button>
          </GridItem>
          <GridItem md={8} />
          <GridItem md={2}>
            <Button onClick={() => cancel()}>Cancel</Button>
            <CustomButton onClick={() => save(type)} color="primary" autoFocus>
              SAVE
            </CustomButton>
          </GridItem>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default withStyles(theme => ({
  DialogContentText: {
    color: "black",
    margin: "0px 18px 15px 5px"
  },
  DialogActions: {
    margin: "15px 30px 15px 0px"
  },
  title: {
    color: "black"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    fontWeight: "bold"
  },
  deleteButton: {
    marginLeft: "19%"
  },
  cardCategoryWhite: {
    color: "grey",
    margin: "0",
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "0",
    "& a:hover,& a:focus": {
      fontSize: 14
    }
  },
  linkTo: {
    color: "grey",
    fontWeight: "lighter",
    textDecoration: "underline"
  }
}))(FormBenefitManageDialog);
