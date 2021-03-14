//npm
import React, { Component } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { List, Map } from "immutable";

//material-ui
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableHead from "@material-ui/core/TableHead/TableHead";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import Button from "@material-ui/core/Button/Button";

//icons
import SentimentVerySatisfied from "@material-ui/icons/SentimentVerySatisfied";

//api
import api from "apis/index";

//internals
import Snackbar from "components/Internals/Snackbar/Snackbar";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";
import FormBenefitManageDialog from "components/FormBenefits/ManageDialog";
import FormBenefitDeleteDialog from "components/FormBenefits/DeleteDialog";

const headers = [
  "Benefit",
  "Maximum Cover",
  "Age Range",
  "Incl. Children?",
  "OccupationType",
  "Occupation Class"
];

class FormBenefitTable extends Component {
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
    dialog: {
      toggleDialog: () => {
        this.setState(state => {
          return {
            ...state,
            manageDialogShow: !state.manageDialogShow
          };
        });
      },
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
          .formBenefitById(jwt, inputs)
          .then(results => {
            this.actions.dialog.toggleDeleteConfirm();

            this.actions.dialog.toggleDialog();

            this.actions.refreshBenefitList(results.data);

            this.actions.showThenHideAlert("showDeleteSuccess");
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

        if (inputs["benefitId"] === null || inputs["statusId"] === null) {
          this.actions.dialog.checkRequired();

          return;
        }

        apiType.formBenefitById(jwt, inputs).then(results => {
          this.actions.showThenHideAlert("showSaveSuccess");

          this.actions.refreshBenefitList(results.data.lists);
        });
      }
    },
    refreshBenefitList: data => {
      this.setState(state => {
        return {
          ...state,
          data: List(data),
          manageDialogShow: false
        };
      });
    },
    insertNew: () => {
      const jwt = this.actions.getJwt();

      const url = this.actions.url;
      api
        .get()
        .formBenefitById(jwt, url.getFormId(), url.getFormVersionId(), -1)
        .then(response => {
          this.actions.updateState(response, "insert");
        });
    },
    getFormBenefitById: (formId, formVersionId, formBenefitId) => {
      const jwt = this.actions.getJwt();

      api
        .get()
        .formBenefitById(jwt, formId, formVersionId, formBenefitId)
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

    const { data, manageDialogShow, dialog } = this.state;

    const { classes } = this.props;

    const {
      toggleDialog,
      handleOnChange,
      handleOnSave,
      toggleDeleteConfirm,
      handleOnDeleteYes
    } = this.actions.dialog;

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
            const child = row.includingChildren;

            return (
              <TableRow
                className={classNames(classes.row, classes.tableRow)}
                key={key}
                hover={true}
              >
                <CustomTableCell
                  component="th"
                  scope="row"
                  className={classes.benefitName}
                >
                  <Link
                    to={`#`}
                    onClick={() =>
                      this.actions.getFormBenefitById(
                        row.formId,
                        row.formVersionId,
                        row.formBenefitId
                      )
                    }
                  >
                    {row.benefitName}
                  </Link>
                </CustomTableCell>
                <CustomTableCell>
                  {row.coverMax === null
                    ? ""
                    : `$${row.coverMax.toLocaleString()}`}
                </CustomTableCell>
                <CustomTableCell>{row.ageRange}</CustomTableCell>
                <CustomTableCell>
                  {child !== null ? (child === true ? "Yes" : "No") : child}
                </CustomTableCell>
                <CustomTableCell>{row.occTypeLabel}</CustomTableCell>
                <CustomTableCell>{row.occupationClass}</CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <CustomTableCell />
            <CustomTableCell />
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
        <FormBenefitManageDialog
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
          message={"Form Benefit successfully deleted"}
          open={this.state.showDeleteSuccess}
        />
        <FormBenefitDeleteDialog
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
  benefitName: {
    width: "300px"
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
}))(FormBenefitTable);
