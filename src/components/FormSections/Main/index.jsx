//npm
import React, { Component } from "react";
import { Map } from "immutable";
import { Link } from "react-router-dom";
import _ from "lodash";
import { withRouter } from "react-router";
import classNames from "classnames";
import Select from "react-select";

//internals
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import CardFooter from "components/Internals/Card/CardFooter";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//internals grids
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import NoSsr from "@material-ui/core/NoSsr";

//icons
import Beenhere from "@material-ui/icons/Beenhere";
import Warning from "@material-ui/icons/Warning";
import Next from "@material-ui/icons/ArrowForwardIos";
import Previous from "@material-ui/icons/ArrowBackIos";

//my components
import FormSectionDialog from "components/FormSections/Dialog";
import SectionDeleteDialog from "components/FormSections/Delete/Dialog";
import SectionNextPrevDialog from "components/FormSections/DialogConfirm";

//api
import api from "apis/index";

//autocomplete component
import autocomplete from "components/Autocomplete/index";

//autocomplete styles
import autocompleteStyles from "assets/jss/autocomplete/index";

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
      id: "sectionName",
      labelText: "Section Name",
      colSpan: 4,
      required: true
    },
    {
      id: "displayName",
      labelText: "Display Name",
      colSpan: 4,
      required: true
    },
    {
      id: "sectionOrder",
      labelText: "Order",
      colSpan: 2,
      required: true,
      numeric: true
    },
    {
      id: "frequencyTypeId",
      labelText: "Frequency",
      colSpan: 2,
      required: true,
      type: "select",
      group: "Frequency"
    }
  ],
  [
    {
      id: "description",
      labelText: "Description",
      colSpan: 8
    },
    {
      id: "category",
      labelText: "Category",
      colSpan: 4,
      type: "select",
      group: "SectionCategory",
      required: true,
      autoComplete: true
    }
  ]
];

function isRequired(isRequired) {
  return typeof isRequired === "undefined" ? false : isRequired;
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

function AutoCompleteInput({
  prop,
  classes,
  selects,
  value,
  onTextChange,
  checkRequired,
  autocomplete
}) {
  const selectStyles = {
    input: base => ({
      ...base,
      color: "black",
      "& input": {
        font: "inherit"
      }
    })
  };

  const suggestions = _.filter(selects.toJS(), { group: prop.group }).map(
    suggestion => ({
      value: suggestion.id,
      label: suggestion.name
    })
  );

  const updatedValue = _.first(_.filter(suggestions, { value: value }));

  const components = autocomplete.components();

  return (
    <GridItem md={prop.colSpan}>
      <NoSsr>
        <div className={classes.autoComplete}>
          <Select
            classes={classes}
            styles={selectStyles}
            options={suggestions}
            components={components}
            onChange={event => onTextChange(event)}
            value={updatedValue}
            textFieldProps={{
              label: "Category *",
              InputLabelProps: {
                shrink: true,
                style: { paddingTop: "5px" }
              }
            }}
            isClearable
            placeholder={"Required *"}
          />
        </div>
      </NoSsr>
    </GridItem>
  );
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
        required={required}
        value={typeof value === "undefined" ? "" : value}
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

function TextInput({
  prop,
  classes,
  value,
  onTextChange,
  formVersion,
  checkRequired
}) {
  const newValue =
    typeof formVersion[prop.id] === "undefined"
      ? value === null
        ? ""
        : value
      : formVersion[prop.id];

  const required = isRequired(prop.required);

  const isError = checkRequiredIfEmpty(value, required);

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
        value={newValue}
        disabled={typeof prop.disabled !== "undefined"}
        type={typeof prop.numeric === "undefined" ? "text" : "number"}
        margin="normal"
        error={checkRequired ? isError : false}
        helperText={checkRequired ? (isError ? "Required" : null) : false}
      />
    </GridItem>
  );
}

function HeaderNewTitle({ classes }) {
  return (
    <p className={classes.cardCategoryWhite}>
      <b style={{ color: "white" }}>Create New Section</b>
    </p>
  );
}

function HeaderTitle({ classes, text }) {
  return (
    <p className={classes.cardCategoryWhite}>
      {"Forms > "}
      <Link
        className={classes.linkTo}
        to={`${process.env.PUBLIC_URL}/forms/${text["formId"]}`}
      >
        {text["formName"]}
      </Link>{" "}
      > Form Versions >{" "}
      <Link
        className={classes.linkTo}
        to={`${process.env.PUBLIC_URL}/forms/${text["formId"]}/formversions/${
          text.formVersionId
        }`}
      >
        {text.versionNumber}
      </Link>
      {" > Sections > "} <b style={{ color: "white" }}>{text.sectionName}</b>
    </p>
  );
}

class Sections extends Component {
  state = {
    dialog: {
      isOpen: false
    }
  };

  actions = {
    handleOnMoveSection: (position, sectionId) => {
      const updatedInputs = this.state.data.toJS();

      const inputs = this.state.originalData.toJS();

      const formId = inputs["formId"];

      const formVersionId = inputs["formVersionId"];

      if (_.isEqual(updatedInputs, inputs) === false) {
        this.actions.nextPrevDialog.toggleDialog(
          formId,
          formVersionId,
          sectionId
        );

        return;
      }

      this.actions.moveToNextPrevSection(formId, formVersionId, sectionId);
    },
    moveToNextPrevSection: (formId, formVersionId, sectionId) => {
      this.props.history.push(
        `${
          process.env.PUBLIC_URL
        }/forms/${formId}/formVersions/${formVersionId}/sections/${sectionId}`
      );

      const _that = this;

      _.delay(function() {
        _that.props.onPrevNextSection();
      }, 100);
    },
    handleOnAutoCompleteChange: event => {
      const name = "category";

      let value = "";

      if (event === null) {
        value = null;
      } else {
        value = event.value;
      }

      this.setState(({ data }) => ({
        data: data.update(name, () => value)
      }));

      return event;
    },
    handleOnChange: event => {
      const { name, value } = event.target;

      this.setState(({ data }) => ({
        data: data.update(name, () => value)
      }));
    },
    copySection: () => {
      this.actions.dialog.open();
    },
    dialog: {
      data: () => {
        const dialogData = (() => {
          const inputs = this.state.originalData.toJS();

          return {
            displayName: inputs["displayName"],
            sectionName: "",
            formVersionId: inputs["formVersionId"],
            sectionId: inputs["sectionId"],
            sectionOrder: inputs["sectionOrder"]
          };
        })();

        return dialogData;
      },
      close: () => {
        this.setState(state => {
          return {
            ...state,
            dialog: {
              ...state.dialog,
              isOpen: !state.dialog.isOpen,
              data: {}
            }
          };
        });
      },
      open: () => {
        const data = this.actions.dialog.data();

        this.setState(state => {
          return {
            ...state,
            dialog: {
              ...state.dialog,
              isOpen: true,
              data
            }
          };
        });
      },
      onChange: event => {
        const { name, value } = event.target;

        this.setState(state => {
          return {
            ...state,
            dialog: {
              ...state.dialog,
              isOpen: true,
              data: {
                ...state.dialog.data,
                [name]: value
              }
            }
          };
        });
      },
      hasValidationErrors: () => {
        const { sectionName } = this.state.dialog.data;

        if (sectionName.trim() === "") {
          this.setState(state => {
            return {
              ...state,
              dialog: {
                ...state.dialog,
                validation: {
                  sectionName: "Section Name is required"
                }
              }
            };
          });

          return true;
        }

        this.setState(state => {
          return {
            ...state,
            dialog: {
              ...state.dialog,
              validation: {}
            }
          };
        });

        return false;
      },
      onSave: () => {
        if (this.actions.dialog.hasValidationErrors()) {
          return;
        }

        const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

        api
          .insert()
          .sectionCopy(jwt, this.state.dialog.data)
          .then(response => {
            if (response.status === 400) {
              this.actions.showAlert("showDuplicateFailed");

              this.setState(state => {
                return {
                  ...state,
                  dialog: {
                    ...state.dialog,
                    validation: {
                      sectionName: "Section Name already exists"
                    }
                  }
                };
              });
            }
            if (response.status === 200) {
              window.open(
                `${process.env.PUBLIC_URL}/forms/${
                  response.data.formId
                }/formVersions/${response.data.formVersionId}/sections/${
                  response.data.sectionId
                }`,
                "_blank"
              );

              this.actions.dialog.close();
            }
          });
      }
    },
    insertNew: () => {
      const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

      const newInputs = _.cloneDeep(this.state.data.toJS());

      newInputs.formVersionId = _.cloneDeep(
        this.state.frmVersionDetails.formVersionId
      );

      api
        .insert()
        .section(jwt, newInputs)
        .then(response => {
          this.actions.eventsAfterPost(response);

          if (typeof response.data !== "undefined") {
            this.props.history.push(
              `${process.env.PUBLIC_URL}/sections/${response.data.sectionId}`
            );
          }
        });
    },
    updateExisting: () => {
      const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

      api
        .update()
        .sectionBySectionId(jwt, this.state.data.toJS())
        .then(response => {
          this.actions.eventsAfterPost(response);
        });
    },
    eventsAfterPost: response => {
      if (typeof response === "undefined") {
        this.actions.showAlert("showUpdateFailed");
        return;
      }

      this.setState(state => {
        return {
          ...state,
          data: Map(response.data),
          originalData: Map(response.data)
        };
      });

      this.actions.showAlert("showUpdateSuccess");
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
        }, 4000);
      };

      this.showThenHideAlert();
    },
    delete: {
      dialog: {
        handleOnCancel: () => {
          this.actions.delete.dialog.toggleDialog();
        },
        handleOnOpen: () => {
          this.actions.delete.dialog.toggleDialog();
        },
        handleOnYes: () => {
          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          const data = this.state.data.toJS();

          const inputs = {
            formId: data["formId"],
            formVersionId: data["formVersionId"],
            sectionId: data["sectionId"]
          };

          api
            .delete()
            .section(jwt, inputs)
            .then(() => {
              let timer;

              (_that => {
                window.clearTimeout(timer);

                timer = window.setTimeout(function() {
                  _that.actions.delete.dialog.toggleSuccessDialog();

                  _that.props.history.push(
                    `${process.env.PUBLIC_URL}/forms/${
                      inputs.formId
                    }/formVersions/${inputs.formVersionId}`
                  );
                }, 1000);
              })(this);

              //--------------------------------------------

              this.actions.delete.dialog.toggleDialog();

              this.actions.delete.dialog.toggleSuccessDialog();
            });
        },
        toggleDialog: () => {
          this.setState(state => {
            return {
              ...state,
              deleteDialogIsOpen: !state.deleteDialogIsOpen
            };
          });
        },
        toggleSuccessDialog: () => {
          this.setState(state => {
            return {
              ...state,
              deleteIsSuccessDelete: !state.deleteIsSuccessDelete
            };
          });
        }
      }
    },
    initSectionDetails: () => {
      const { data, selects, history, nextPrevSections } = this.props;

      const historyState = history.location.state;

      this.setState(state => {
        return {
          ...state,
          data: _.cloneDeep(data),
          originalData: _.cloneDeep(data),
          selects: _.cloneDeep(selects),
          frmVersionDetails:
            typeof historyState === "undefined"
              ? {}
              : historyState.frmVersionDetails,
          nextPrevSections: _.cloneDeep(nextPrevSections)
        };
      });
    },
    onNextPrevUpdateInitSectionDetails: prevState => {
      if (typeof prevState.nextPrevSections !== "undefined") {
        if (
          _.isEqual(
            prevState.nextPrevSections.toJS(),
            this.props.nextPrevSections.toJS()
          ) === false
        ) {
          this.actions.initSectionDetails();
        }
      }
    },
    nextPrevDialog: {
      onCancel: () => {
        this.actions.nextPrevDialog.toggleDialog();
      },
      onYes: () => {
        const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

        api
          .update()
          .sectionBySectionId(jwt, this.state.data.toJS())
          .then(() => {
            this.actions.nextPrevDialog.onNo();

            this.actions.showAlert("showUpdateSuccess");
          });
      },
      onNo: () => {
        const { formId, formVersionId, sectionId } = this.state.nextPrevState;

        this.actions.moveToNextPrevSection(formId, formVersionId, sectionId);

        this.actions.nextPrevDialog.toggleDialog(
          formId,
          formVersionId,
          sectionId
        );
      },
      toggleDialog: (formId, formVersionId, sectionId) => {
        this.setState(state => {
          return {
            ...state,
            nextPrevDialog: !state.nextPrevDialog,
            nextPrevState: {
              formId,
              formVersionId,
              sectionId
            }
          };
        });
      }
    },
    handleChange: name => value => {
      this.setState({
        [name]: value
      });
    }
  };

  componentDidMount() {
    this.actions.initSectionDetails();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.actions.onNextPrevUpdateInitSectionDetails(prevState);
  }

  render() {
    const { classes, isInsertNew } = this.props;

    const {
      handleOnChange,
      nextPrevDialog,
      handleOnAutoCompleteChange
    } = this.actions;

    const { data, frmVersionDetails, dialog, nextPrevSections } = this.state;

    const onDelete = this.actions.delete.dialog;

    if (typeof data === "undefined") {
      return <div>Fetching...</div>;
    }

    const text = data.toJS();

    const { next, previous } = nextPrevSections.toJS();

    const headerTitle = isInsertNew ? (
      <HeaderNewTitle classes={classes} />
    ) : (
      <HeaderTitle classes={classes} text={text} />
    );

    return (
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            <b>{text.displayName}</b>
          </h4>
          {headerTitle}
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem md={1} />
            <GridItem md={10}>
              {inputFields.map((props, keys) => {
                return (
                  <GridContainer key={keys}>
                    {props.map((propColumn, key) => {
                      const columnValue = this.state.data.toJS()[propColumn.id];

                      const value = columnValue === null ? "" : columnValue;

                      const formVersion = this.state.frmVersionDetails;

                      return typeof propColumn.type === "undefined" ? (
                        <TextInput
                          key={key}
                          prop={propColumn}
                          classes={classes}
                          value={value}
                          onTextChange={handleOnChange}
                          formVersion={formVersion}
                          checkRequired={true}
                        />
                      ) : typeof propColumn.autoComplete === "undefined" ? (
                        <SelectInput
                          key={key}
                          prop={propColumn}
                          classes={classes}
                          selects={this.state.selects}
                          value={value}
                          onTextChange={handleOnChange}
                          checkRequired={true}
                        />
                      ) : (
                        <AutoCompleteInput
                          key={key}
                          prop={propColumn}
                          selects={this.state.selects}
                          classes={classes}
                          onTextChange={handleOnAutoCompleteChange}
                          value={value}
                          autocomplete={autocomplete}
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
            variant="outlined"
            size="small"
            color="primary"
            className={classes.copySection}
            onClick={() => this.actions.copySection()}
          >
            Copy Section
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            className={classes.deleteSection}
            onClick={() => this.actions.delete.dialog.handleOnOpen()}
          >
            Delete Section
          </Button>

          <Button
            variant="raised"
            size="small"
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
          <Link
            to={`${process.env.PUBLIC_URL}/forms/${
              text["formId"]
            }/formVersions/${
              typeof frmVersionDetails.formVersionId === "undefined"
                ? typeof text["formVersionId"] === "undefined"
                  ? ""
                  : text["formVersionId"]
                : frmVersionDetails.formVersionId
            }`}
          >
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              style={{ marginRight: "1%" }}
            >
              Cancel
            </Button>
          </Link>

          <Button
            variant="outlined"
            size="small"
            color={"primary"}
            className={classes.nextButtonMargin}
            disabled={previous === 0}
            onClick={() => this.actions.handleOnMoveSection("prev", previous)}
          >
            <Previous className={classNames(classes.leftIcon)} />
            PREV Section
          </Button>
          <Button
            variant="outlined"
            size="small"
            color={"primary"}
            className={classes.prevButtonMargin}
            disabled={next === 0}
            onClick={() => this.actions.handleOnMoveSection("next", next)}
          >
            Next Section
            <Next className={classNames(classes.rightIcon)} />
          </Button>
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
        <Snackbar
          place="br"
          color="danger"
          icon={Warning}
          message={
            <span>
              <b>Oops!</b> Section Name must be unique. No other Section linked
              to the current FormVersion with the same Section Name.
            </span>
          }
          open={this.state.showDuplicateFailed}
        />
        <Snackbar
          place="br"
          color="success"
          icon={Beenhere}
          message={"Section was deleted successfully."}
          open={this.state.deleteIsSuccessDelete}
        />
        <FormSectionDialog dialog={dialog} actions={this.actions.dialog} />
        <SectionDeleteDialog
          isOpen={this.state.deleteDialogIsOpen}
          cancel={onDelete.handleOnCancel}
          yes={onDelete.handleOnYes}
        />
        <SectionNextPrevDialog
          isOpen={this.state.nextPrevDialog}
          yes={nextPrevDialog.onYes}
          no={nextPrevDialog.onNo}
          cancel={nextPrevDialog.onCancel}
        />
      </Card>
    );
  }
}

export default withRouter(
  withStyles(theme => ({
    copySection: {
      position: "absolute",
      left: 0,
      marginLeft: "10.5%"
    },
    deleteSection: {
      position: "absolute",
      left: 0,
      marginLeft: "20.5%"
    },
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
    },
    leftIcon: {
      marginRight: "5px"
    },
    rightIcon: {
      marginLeft: "5px"
    },
    nextButtonMargin: {
      float: "right",
      marginRight: "27%"
    },
    prevButtonMargin: {
      float: "right",
      marginRight: "-24.5%"
    },
    ...autocompleteStyles.getAll(theme),
    autoComplete: {
      marginTop: "4%",
      padding: "0px 0px 0px 8px !important",
      width: "100% !important"
    }
  }))(Sections)
);
