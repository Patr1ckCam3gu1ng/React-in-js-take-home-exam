//npm
import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { List, Map } from "immutable";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Button from "@material-ui/core/Button/Button";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";
import FormAdviserManageDialog from "components/FormAdviser/ManageDialog";
import AdviserDetailsDeleteDialog from "components/FormAdviser/DeleteDialog";

//internals
import Snackbar from "components/Internals/Snackbar/Snackbar";

//api
import api from "apis/index";

//icons
import SentimentVerySatisfied from "@material-ui/icons/SentimentVerySatisfied";

class FormAdviser extends Component {
  actions = {
    getJwt: () => {
      const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

      return jwt;
    },
    url: {
      getFormVersionId: () => {
        const url = window.location.href.split("/");

        const formVersionId = url[url.length - 1];

        return formVersionId;
      },
      getFormId: () => {
        const url = window.location.href.split("/");

        const formId = url[url.length - 3];

        return formId;
      }
    },
    insertNew: () => {
      const jwt = this.actions.getJwt();

      const url = this.actions.url;
      api
        .get()
        .adviserDetailsByAdviserId(
          jwt,
          url.getFormId(),
          url.getFormVersionId(),
          -1
        )
        .then(response => {
          this.actions.updateState(response, "insert");
        });
    },
    dialog: {
      toggleDeleteConfirm: () => {
        this.setState(state => {
          return {
            ...state,
            showDeleteConfirm: !state.showDeleteConfirm
          };
        });
      },
      handleOnDeleteYes: () => {
        const inputs = this.state.dialog.data.toJS();

        const jwt = this.actions.getJwt();

        api
          .delete()
          .adviserDetailsByAdviserId(jwt, inputs)
          .then(results => {
            this.actions.dialog.toggleDeleteConfirm();

            this.actions.dialog.toggleDialog();

            this.actions.refreshAdviserLists(results.data);

            this.actions.showThenHideAlert("showDeleteSuccess");
          });
      },
      toggleDialog: () => {
        this.setState(state => {
          return {
            ...state,
            manageDialogShow: !state.manageDialogShow
          };
        });
      },
      handleOnChange: event => {
        const { name, value } = event.target;

        this.setState(({ dialog }) => ({
          dialog: {
            ...dialog,
            data: dialog.data.update(name, () => value)
          }
        }));
      },
      handleOnSave: type => {
        const inputs = this.state.dialog.data.toJS();

        const jwt = this.actions.getJwt();

        const apiType = type === "update" ? api.update() : api.insert();

        if (
          inputs["label"] === "" ||
          inputs["order"] === "" ||
          inputs["label"] === null ||
          inputs["order"] === null
        ) {
          this.actions.dialog.checkRequired();

          return;
        }

        apiType.adviserDetailsByAdviserId(jwt, inputs).then(results => {
          this.actions.showThenHideAlert("showSaveSuccess");

          this.actions.refreshAdviserLists(results.data.lists);
        });
      },
      checkRequired: () => {
        this.setState(state => {
          return {
            ...state,
            dialog: {
              ...state.dialog,
              checkRequired: true
            }
          };
        });
      }
    },
    refreshAdviserLists: data => {
      this.setState(state => {
        return {
          ...state,
          data: List(data),
          manageDialogShow: false
        };
      });
    },
    showThenHideAlert: stateName => {
      this.setState(state => {
        return {
          ...state,
          [stateName]: true
        };
      });

      let timer;

      (_that => {
        window.clearTimeout(timer);

        timer = window.setTimeout(function() {
          _that.setState(state => {
            return {
              ...state,
              [stateName]: false
            };
          });
        }, 2000);
      })(this);
    },
    getAdviserByIds: (formId, formVersionId, adviserId) => {
      const jwt = this.actions.getJwt();

      api
        .get()
        .adviserDetailsByAdviserId(jwt, formId, formVersionId, adviserId)
        .then(response => {
          this.actions.updateState(response, "update");
        });
    },
    updateState: (response, type) => {
      this.setState(state => {
        return {
          ...state,
          dialog: {
            data: Map(response.result),
            selects: List(response.selects),
            type: type
          }
        };
      });

      this.actions.dialog.toggleDialog();
    }
  };
  componentDidMount() {
    const { data } = this.props;

    this.setState(() => {
      return {
        data
      };
    });
  }

  render() {
    if (this.state === null) {
      return <span />;
    }

    const { classes } = this.props;

    const { data, manageDialogShow, dialog } = this.state;

    const {
      toggleDialog,
      handleOnChange,
      handleOnSave,
      toggleDeleteConfirm,
      handleOnDeleteYes
    } = this.actions.dialog;

    const headers = ["Order", "Label", "Type", "Legacy PDF Id"];

    return (
      <React.Fragment>
        <TableHead>
          <TableRow>
            {headers.map((props, key) => {
              return <CustomTableCell key={key}>{props}</CustomTableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, key) => {
            return (
              <TableRow
                className={classNames(classes.row, classes.tableRow)}
                key={key}
                hover={true}
              >
                <CustomTableCell className={classes.order}>
                  {row.order}
                </CustomTableCell>
                <CustomTableCell className={classes.label}>
                  <Link
                    to={"#"}
                    onClick={() =>
                      this.actions.getAdviserByIds(
                        row.formId,
                        row.formVersionId,
                        row.adviserDetailsId
                      )
                    }
                  >
                    {row.label}
                  </Link>
                </CustomTableCell>
                <CustomTableCell className={classes.typeName}>
                  {row.typeName}
                </CustomTableCell>
                <CustomTableCell className={classes.legacyPdfId}>
                  {row.legacyPdfId}
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <CustomTableCell />
            <CustomTableCell />
            <CustomTableCell />
            <CustomTableCell>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                className={classes.button}
                onClick={() => this.actions.insertNew()}
              >
                Add New
              </Button>
            </CustomTableCell>
          </TableRow>
        </TableFooter>
        <FormAdviserManageDialog
          isOpen={manageDialogShow}
          cancel={toggleDialog}
          dialog={dialog}
          handleOnChange={handleOnChange}
          save={handleOnSave}
          deleteForm={toggleDeleteConfirm}
        />
        <Snackbar
          place="br"
          color="success"
          icon={SentimentVerySatisfied}
          message={
            <span>
              <b>Yes!</b> Updates were saved successfully
            </span>
          }
          open={this.state.showSaveSuccess}
        />
        <Snackbar
          place="br"
          color="success"
          icon={SentimentVerySatisfied}
          message={"Adviser Details successfully deleted"}
          open={this.state.showDeleteSuccess}
        />
        <AdviserDetailsDeleteDialog
          isOpen={this.state.showDeleteConfirm}
          cancel={toggleDeleteConfirm}
          yes={handleOnDeleteYes}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(theme => ({
  tableRow: {
    width: "1000px"
  },
  order: {
    width: "10%"
  },
  label: {
    width: "50%"
  },
  typeName: {
    width: "20%"
  },
  legacyPdfId: {
    width: "20%"
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  button: {
    margin: "5px",
    float: "right"
  }
}))(FormAdviser);
