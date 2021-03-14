//npm
import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { Map } from "immutable";
import { withRouter } from "react-router";

//material-ui
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";
import withStyles from "@material-ui/core/styles/withStyles";

//icons
import Beenhere from "@material-ui/icons/Beenhere";
import Warning from "@material-ui/icons/Warning";

//internals
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import CardFooter from "components/Internals/Card/CardFooter";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//internals grids
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//api
import api from "apis/index";

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
      required: true
    }
  ],
  [
    {
      id: "validFrom",
      labelText: "Valid From",
      colSpan: 4,
      required: true,
      isDate: true
    },
    {
      id: "validTo",
      labelText: "Valid To",
      colSpan: 4,
      isDate: true
    },
    {
      id: "formVersionStatus",
      labelText: "Status",
      colSpan: 4,
      required: true,
      type: "select",
      group: "Status"
    }
  ],
  [
    {
      id: "pdfFilePath",
      labelText: "PDF File Path",
      colSpan: 8,
      required: true
    },
    {
      id: "pdfType",
      labelText: "PDF Type",
      colSpan: 4,
      required: true,
      type: "select",
      group: "PDFType"
    }
  ],
  [
    {
      id: "signatureType",
      labelText: "Signature Type",
      colSpan: 4,
      required: true,
      type: "select",
      group: "SignatureType"
    },
    {
      id: "totalCoverMax",
      labelText: "Maximum Total Cover",
      colSpan: 4,
      isNumber: true
    }
  ],
  [
    {
      id: "maxClients",
      labelText: "Maximum Clients",
      colSpan: 4,
      isNumber: true
    },
    {
      id: "maxAdults",
      labelText: "Maximum Adults",
      colSpan: 4,
      isNumber: true
    },
    {
      id: "maxChildren",
      labelText: "Maximum Children",
      colSpan: 4,
      isNumber: true
    }
  ]
];

function isRequired(isRequired) {
  return typeof isRequired === "undefined" ? false : isRequired;
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
        type={typeof prop.isNumber === "undefined" ? "text" : "number"}
        margin="normal"
        // error={checkRequired ? isError : false}
        // helperText={checkRequired ? (isError ? "Required" : null) : false}
      />
    </GridItem>
  );
}

function SelectInput({ prop, classes, selects, value, onTextChange }) {
  const inputProps = {
    style: {
      fontSize: "14px"
    }
  };

  const newValue = value === null ? "" : value;

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
        value={newValue}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          },
          ...inputProps
        }}
        margin="normal"
        // error={checkRequired ? isError : false}
        // helperText={checkRequired ? (isError ? "Required" : null) : false}
      >
        {_.filter(selects.toJS(), { group: prop.group }).map(
          (selectProp, key) => {
            // const newValue = selectProp.id === 0 ? -1 : selectProp.id;

            return (
              <MenuItem key={key} value={selectProp.id}>
                {selectProp.name}
              </MenuItem>
            );
          }
        )}
      </TextField>
    </GridItem>
  );
}

class FormVersions extends Component {
  state = {
    showUpdateSuccess: false,
    showUpdateFailed: false,
    showDuplicateFailed: false
  };

  actions = {
    handleOnChange: event => {
      const { name, value } = event.target;

      this.setState(({ data }) => ({
        data: data.update(name, () => value)
      }));
    },
    getDetails: () => {
      const { data, selects } = this.props;

      this.setState(state => {
        return {
          ...state,
          data: _.cloneDeep(data),
          selects: _.cloneDeep(selects)
        };
      });
    },
    insertNew: () => {
      const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

      api
        .insert()
        .formVersion(jwt, this.state.data.toJS())
        .then(response => {
          const data = response.data;

          this.props.history.push(
            `${process.env.PUBLIC_URL}/forms/${data.formId}/formversions/${
              data.formVersionId
            }`
          );
        });
    },
    updateExisting: () => {
      const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

      api
        .update()
        .formVersion(jwt, this.state.data.toJS())
        .then(response => {
          if (typeof response === "undefined") {
            this.actions.showAlert("showUpdateFailed");
            return;
          }

          this.setState(state => {
            return {
              ...state,
              data: Map(response.data)
            };
          });

          this.actions.showAlert("showUpdateSuccess");
        });
    },
    showAlert: stateName => {
      this.setState(state => {
        return {
          ...state,
          [stateName]: true
        };
      });

      let timer;

      const _that = this;

      this.showThenHideAlert = () => {
        window.clearTimeout(timer);

        timer = window.setTimeout(function() {
          _that.setState(state => {
            return {
              ...state,
              [stateName]: false
            };
          });
        }, 2500);
      };

      this.showThenHideAlert();
    }
  };

  componentDidMount() {
    this.actions.getDetails();
  }

  render() {
    const { classes } = this.props;

    const { handleOnChange } = this.actions;

    if (typeof this.state.data === "undefined") {
      return <div />;
    }

    const data = this.state.data.toJS();

    const isInsertNew = data["formVersionId"] === 0;

    return (
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            <b>{data.versionNumber}</b>
          </h4>
          <p className={classes.cardCategoryWhite}>
            {"Forms > "}
            <Link
              className={classes.linkTo}
              to={`${process.env.PUBLIC_URL}/forms/${data.formId}`}
            >
              {data.formName}
            </Link>{" "}
            > Form Versions >{" "}
            <b style={{ color: "white" }}>
              {data.versionNumber === null
                ? "[ Add New Form Version ]"
                : data.versionNumber}
            </b>
          </p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem md={1} />
            <GridItem md={10}>
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
                        />
                      ) : (
                        <SelectInput
                          key={key}
                          prop={propColumn}
                          classes={classes}
                          selects={this.state.selects}
                          value={value}
                          onTextChange={handleOnChange}
                        />
                      );
                    })}
                  </GridContainer>
                );
              })}
            </GridItem>
            <GridItem md={1} />
          </GridContainer>
        </CardBody>
        <Divider light={true} style={{ marginTop: "1%" }} />
        <CardFooter style={{ display: "block", marginRight: "1%" }}>
          <Button
            variant="raised"
            size="large"
            color="primary"
            className={classes.button}
            onClick={() =>
              isInsertNew
                ? this.actions.insertNew()
                : this.actions.updateExisting()
            }
          >
            Save
          </Button>
          <Link to={`${process.env.PUBLIC_URL}/forms/${data.formId}`}>
            <Button
              variant="outlined"
              size="large"
              className={classes.button}
              style={{ marginRight: "1%" }}
            >
              Cancel
            </Button>
          </Link>
        </CardFooter>
        <Snackbar
          place="br"
          color="success"
          icon={Beenhere}
          message={
            <span>
              <b>Yes!</b> Updates were saved successfully
            </span>
          }
          open={this.state.showUpdateSuccess}
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Warning}
          message={
            <span>
              <b>Oops!</b> Something went wong. Failed to save your changes
            </span>
          }
          open={this.state.showUpdateFailed}
        />
      </Card>
    );
  }
}

export default withRouter(
  withStyles(theme => ({
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    },
    linkTo: {
      color: "white",
      fontWeight: "lighter",
      textDecoration: "underline"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: "100%",
      fontWeight: "bold"
    },
    button: {
      float: "right",
      marginRight: "8%"
    }
  }))(FormVersions)
);
