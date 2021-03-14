//npm
import React from "react";
import { Link } from "react-router-dom";
import { List, Map } from "immutable";
import _ from "lodash";
import { withRouter } from "react-router";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";

import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";

//internals
import Snackbar from "components/Internals/Snackbar/Snackbar";
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import CardFooter from "components/Internals/Card/CardFooter";

//Grids
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//icons
import Beenhere from "@material-ui/icons/Beenhere";

//api
import apis from "apis/index";

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
        type={"text"}
        margin="normal"
        // error={checkRequired ? isError : false}
        // helperText={checkRequired ? (isError ? "Required" : null) : false}
      />
    </GridItem>
  );
}

function SelectInput({
  prop,
  classes,
  selects,
  value,
  onTextChange,
  isNewInsert
}) {
  const inputProps = {
    style: {
      fontSize: "14px"
    }
  };

  return (
    <GridItem md={prop.colSpan}>
      <TextField
        id={prop.id}
        select
        label={prop.labelText}
        className={classes.textField}
        onChange={event => onTextChange(event)}
        name={prop.id}
        required={isNewInsert === true ? false : isRequired(prop.required)}
        value={value}
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
        {_.filter(selects.toJS(), { group: prop.group }).map(selectProp => {
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

export default withRouter(
  withStyles(theme => ({
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
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
    root: {
      width: "100%",
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto"
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      },
      "& a:hover,& a:focus": {
        fontSize: 13
      }
    },
    button: {
      float: "right",
      marginRight: "8%"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: "100%",
      fontWeight: "bold"
    },
    linkTo: {
      color: "white",
      fontWeight: "lighter",
      textDecoration: "underline"
    }
  }))(
    class FormsInput extends React.Component {
      actions = {
        getAuthHeader: () => {
          return `Bearer ${localStorage.getItem("jwtToken")}`;
        },
        getFields: () => {
          return [
            [
              {
                id: "providerName",
                labelText: "Provider",
                colSpan: 4,
                required: true,
                disabled: true,
                group: "Providers"
              },
              {
                id: "formTypeId",
                labelText: "Form Type",
                colSpan: 4,
                required: true,
                type: "select",
                group: "FormType"
              },
              {
                id: "formStatusId",
                labelText: "Status",
                colSpan: 4,
                required: true,
                type: "select",
                group: "Status"
              }
            ],
            [
              {
                id: "formName",
                labelText: "Form Name",
                colSpan: 12,
                required: true
              }
            ]
          ];
        },
        getFormIdFromUrl: () => {
          const url = window.location.href.split("/");

          const questionId = url[url.length - 1];

          return questionId;
        },
        onTextChange: event => {
          const { name, value } = event.target;

          if (name === "providerName") {
            //immutable state
            this.setState(({ data }) => ({
              data: data.update("providerId", () => value)
            }));
          }

          //immutable state
          this.setState(({ data }) => ({
            data: data.update(name, () => value)
          }));
        },
        onInsertNew: () => {
          this.api.insertNew();
        },
        updateExisting: () => {
          const inputs = this.state.data;

          this.api.updateExisting(inputs);
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

      api = {
        insertNew: () => {
          apis
            .insert()
            .formById(this.actions.getAuthHeader(), this.state.data.toJS())
            .then(response => {
              this.props.history.push(
                `${process.env.PUBLIC_URL}/forms/${response.data.formId}`
              );

              window.location.reload();
            });
        },
        getInitialDetails: () => {
          apis
            .get()
            .formsById(
              this.actions.getAuthHeader(),
              this.actions.getFormIdFromUrl()
            )
            .then(response => {
              this.setState(state => {
                return {
                  ...state,
                  data: Map(response.result),
                  selects: List(response.selects),
                  formName:
                    response.result.formId === null
                      ? "Add New Form"
                      : response.result.formName
                };
              });
            });
        },
        updateExisting: inputs => {
          apis
            .update()
            .formsById(
              this.actions.getAuthHeader(),
              inputs,
              this.actions.getFormIdFromUrl()
            )
            .then(response => {
              this.actions.showAlert("showUpdateSuccess");

              this.setState(state => {
                return {
                  ...state,
                  data: Map(response),
                  formName: response.formName
                };
              });
            });
        }
      };

      componentDidMount() {
        this.api.getInitialDetails();
      }

      render() {
        if (this.state === null) {
          return <div />;
        }

        const { classes } = this.props;

        const { data, selects, formName } = this.state;

        const isNewInsert = this.actions.getFormIdFromUrl() === "0";

        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>
                    <b>{formName}</b>
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    <Link
                      className={classes.linkTo}
                      to={`${process.env.PUBLIC_URL}/forms`}
                    >
                      {"Forms"}
                    </Link>{" "}
                    {" > "}
                    {formName}
                  </p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem md={1} />
                    <GridItem md={10}>
                      {this.actions.getFields().map((props, keys) => {
                        return (
                          <GridContainer key={keys}>
                            {props.map((propColumn, key) => {
                              let value =
                                typeof data === "undefined"
                                  ? ""
                                  : data.toJS()[propColumn.id];

                              value = value === null ? "" : value;

                              const enableProvider =
                                propColumn.id === "providerName" && isNewInsert;

                              return typeof propColumn.type === "undefined" &&
                                enableProvider === false ? (
                                <TextInput
                                  key={key}
                                  prop={propColumn}
                                  classes={classes}
                                  value={value}
                                  onTextChange={this.actions.onTextChange}
                                />
                              ) : (
                                <SelectInput
                                  key={key}
                                  prop={propColumn}
                                  classes={classes}
                                  selects={selects}
                                  value={value}
                                  onTextChange={this.actions.onTextChange}
                                  isNewInsert={isNewInsert}
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
                      isNewInsert
                        ? this.actions.onInsertNew()
                        : this.actions.updateExisting()
                    }
                  >
                    Save
                  </Button>
                  <Link to={`${process.env.PUBLIC_URL}/forms`}>
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
              </Card>
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
            </GridItem>
          </GridContainer>
        );
      }
    }
  )
);
