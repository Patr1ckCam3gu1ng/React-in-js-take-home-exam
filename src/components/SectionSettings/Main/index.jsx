//npm
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Map } from "immutable";

//internals grids
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//internals
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import CardFooter from "components/Internals/Card/CardFooter";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//material-ui
import Divider from "@material-ui/core/Divider/Divider";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";

//icons
import Beenhere from "@material-ui/icons/Beenhere";

//api
import api from "apis/index";

//common
import commonAction from "common/index";

function isRequired(isRequired) {
  return typeof isRequired === "undefined" ? false : isRequired;
}

function SelectInput({ prop, classes, selects, value, onTextChange }) {
  const inputProps = {
    style: {
      fontSize: "14px",
    },
  };

  const selectById = selects[prop.id];

  return (
    <GridItem md={prop.colSpan}>
      <TextField
        id={prop.id}
        select
        label={prop.labelText}
        className={classes.textField}
        onChange={(event) => onTextChange(event)}
        name={prop.id}
        required={isRequired(prop.required)}
        value={value === null || typeof value === "undefined" ? "" : value}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
          ...inputProps,
        }}
        margin="normal"
        // error={checkRequired ? isError : false}
        // helperText={checkRequired ? (isError ? "Required" : null) : false}
      >
        {typeof selectById === "undefined" ? (
          <span />
        ) : (
          selectById.map((selectProp) => {
            // const newValue = selectProp.id === 0 ? -1 : selectProp.id;

            return (
              <MenuItem key={selectProp.id} value={selectProp.id}>
                {selectProp.name}
              </MenuItem>
            );
          })
        )}
      </TextField>
    </GridItem>
  );
}

function TextInput({ prop, classes, value, onTextChange }) {
  const type = typeof prop.numeric === "undefined" ? "text" : "number";

  return (
    <GridItem md={prop.colSpan}>
      <TextField
        id={prop.id}
        label={prop.labelText}
        className={classes.textField}
        placeholder={prop.labelText}
        onChange={(event) => onTextChange(event, type === "number")}
        name={prop.id}
        required={isRequired(prop.required)}
        value={value}
        disabled={typeof prop.disabled !== "undefined"}
        type={type}
        margin="normal"

        // error={checkRequired ? isError : false}
        // helperText={checkRequired ? (isError ? "Required" : null) : false}
      />
    </GridItem>
  );
}

const inputFields = [
  [
    {
      id: "providerName",
      labelText: "Provider",
      colSpan: 4,
      required: true,
      disabled: true,
    },
    {
      id: "formName",
      labelText: "Form",
      colSpan: 4,
      required: true,
      disabled: true,
    },
    {
      id: "versionNumber",
      labelText: "Form Version",
      colSpan: 4,
      required: true,
      disabled: true,
    },
  ],
  [
    {
      id: "sectionName",
      labelText: "Section",
      colSpan: 4,
      required: true,
      disabled: true,
    },
    {
      id: "applicability",
      labelText: "Applicability",
      colSpan: 4,
      required: true,
      type: "select",
    },
    {
      id: "clientType",
      labelText: "Client Type",
      colSpan: 4,
      type: "select",
    },
  ],
  [
    {
      id: "gender",
      labelText: "Gender",
      colSpan: 4,
      required: true,
      type: "select",
    },
    {
      id: "status",
      labelText: "Status",
      colSpan: 4,
      required: true,
      type: "select",
    },
  ],
];

export default withRouter(
  withStyles((theme) => ({
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: "100%",
      fontWeight: "bold",
    },
    button: {
      float: "right",
      marginRight: "8%",
    },
    linkTo: {
      color: "white",
      fontWeight: "lighter",
      textDecoration: "underline",
    },
  }))(
    class SectionSettings extends Component {
      api = {
        getInitialDetails: () => {
          api
            .get()
            .sectionSettingInitial(
              this.actions.getAuthHeader(),
              this.actions.getSectionIdFromUrl()
            )
            .then((response) => {
              this.setState(() => {
                return {
                  data: Map(response),
                  sectionSettingId: this.actions.getSectionSettingIdFromUrl(),
                };
              });
            });
        },
        getById: () => {
          api
            .get()
            .sectionSettingById(
              this.actions.getAuthHeader(),
              this.actions.getSectionIdFromUrl(),
              this.actions.getSectionSettingIdFromUrl()
            )
            .then((response) => {
              this.setState(() => {
                return {
                  data: Map(response),
                  sectionSettingId: this.actions.getSectionSettingIdFromUrl(),
                };
              });
            });
        },
        insertNew: () => {
          api
            .insert()
            .sectionSetting(
              this.actions.getAuthHeader(),
              this.state.data.toJS()
            )
            .then((response) => {
              const {
                formId,
                formVersionId,
                sectionSettingId,
                sectionId,
              } = response.data;

              window.location = `${process.env.PUBLIC_URL}/forms/${formId}/formversions/${formVersionId}/sections/${sectionId}/sectionSettings/${sectionSettingId}`;
            });
        },
        updateExisting: () => {
          api
            .update()
            .sectionSettingById(
              this.actions.getAuthHeader(),
              this.actions.getSectionSettingIdFromUrl(),
              this.actions.getSectionIdFromUrl(),
              this.state.data.toJS()
            )
            .then(() => {
              this.actions.showSuccess();

              setTimeout(function () {
                window.location.reload();
              }, 1200);
            });
        },
      };

      actions = {
        showSuccess: () => {
          this.setState((state) => {
            return {
              ...state,
              showAlert: true,
            };
          });

          let timer;

          const _that = this;

          this.showThenHideAlert = () => {
            window.clearTimeout(timer);

            timer = window.setTimeout(function () {
              _that.setState((state) => {
                return {
                  ...state,
                  showAlert: false,
                };
              });
            }, 1000);
          };

          this.showThenHideAlert();
        },
        getAuthHeader: () => {
          return `Bearer ${localStorage.getItem("jwtToken")}`;
        },
        getSectionIdFromUrl: () => {
          return commonAction.getSectionId();
        },
        getSectionSettingIdFromUrl: () => {
          const url = window.location.href.split("/");

          const questionId = url[url.length - 1];

          return questionId;
        },
        handleOnChange: (event, isNumbered) => {
          const { name, value } = event.target;

          const newValue =
            typeof isNumbered === "undefined"
              ? value
              : isNumbered
              ? parseInt(value, 10)
              : value;

          //immutable state
          this.setState(({ data }) => ({
            data: data.update(name, () => newValue),
          }));
        },
        handleOnInsertNew: () => {
          this.api.insertNew();
        },
        handleUpdateExisting: () => {
          this.api.updateExisting();
        },
      };

      componentDidMount() {
        if (this.actions.getSectionIdFromUrl() === "0") {
          this.api.getInitialDetails();
        } else {
          this.api.getById();
        }
      }

      render() {
        const { classes } = this.props;

        if (this.state === null) {
          return <div />;
        }

        const {
          versionNumber,
          sectionId,
          sectionName,
          formVersionId,
          formId,
          formName,
        } = this.state.data.toJS();

        return (
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                <b>{"Section Settings"}</b>
              </h4>
              {"Forms > "}
              <Link
                className={classes.linkTo}
                to={`${process.env.PUBLIC_URL}/forms/${formId}`}
              >
                {formName}
              </Link>

              {" > Form Versions > "}
              <Link
                className={classes.linkTo}
                to={`${process.env.PUBLIC_URL}/forms/${formId}/formversions/${formVersionId}`}
              >
                {versionNumber}
              </Link>
              {" > Sections > "}
              <Link
                className={classes.linkTo}
                to={`${process.env.PUBLIC_URL}/forms/${formId}/formversions/${formVersionId}/sections/${sectionId}`}
              >
                {sectionName}
              </Link>
              <b>{" > Section Settings"}</b>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem md={1} />
                <GridItem md={10}>
                  {inputFields.map((props, keys) => {
                    return (
                      <GridContainer key={keys}>
                        {props.map((propColumn, key) => {
                          if (typeof propColumn.id === "undefined") {
                            return <GridItem md={propColumn.colSpan} />;
                          }
                          if (this.state === null) {
                            return <div />;
                          }

                          const state = this.state.data;

                          let value = state.toJS()[propColumn.id];

                          const selects = state.toJS().selects;

                          const onTextChange = this.actions.handleOnChange;

                          if (
                            propColumn.id === "clientType" &&
                            value === null
                          ) {
                            value = -1;
                          }

                          return typeof propColumn.type === "undefined" ? (
                            <TextInput
                              key={key}
                              prop={propColumn}
                              classes={classes}
                              value={value}
                              onTextChange={onTextChange}
                            />
                          ) : (
                            <SelectInput
                              key={key}
                              prop={propColumn}
                              classes={classes}
                              selects={selects}
                              value={value}
                              onTextChange={onTextChange}
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
                  this.actions.getSectionSettingIdFromUrl() === "0"
                    ? this.actions.handleOnInsertNew()
                    : this.actions.handleUpdateExisting()
                }
              >
                Save
              </Button>
              <Link
                to={`${process.env.PUBLIC_URL}/forms/${formId}/formversions/${formVersionId}/sections/${sectionId}`}
              >
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
              open={this.state === null ? false : this.state.showAlert}
            />
          </Card>
        );
      }
    }
  )
);
