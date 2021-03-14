//npm
import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { List } from "immutable";
import _ from "lodash";
import classNames from "classnames";

//components
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import CardFooter from "components/Internals/Card/CardFooter";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//my components
import OptionsDialog from "components/QuestionManage/options/gridOptionsDialog";
import GridOptionsDialogConfirm from "components/QuestionManage/options/gridOptionsDialogConfirm";
import OptionsDialogQuickAdd from "components/QuestionManage/options/gridOptionsDialogQuickAdd";

//material-ui
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Paper from "@material-ui/core/Paper/Paper";
import TableCell from "@material-ui/core/TableCell/TableCell";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import purple from "@material-ui/core/es/colors/purple";

//api
import api from "apis/index";

//icons
import Warning from "@material-ui/icons/Warning";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import OfflineBolt from "@material-ui/icons/OfflineBolt";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

const CustomTableCell = withStyles(() => ({
  head: {
    color: "#a13bb6",
    fontSize: 15
  },
  body: {
    fontSize: 12.5,
    maxWidth: "130px",
    minWidth: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&,& a,& a:hover,& a:focus": {
      fontSize: 12.5
    }
  }
}))(TableCell);

const headers = ["Order", "Option Label", "Value"];

function CreateTableContents({ classes, data, onEditDialog }) {
  return (
    <React.Fragment>
      <TableHead>
        <TableRow>
          {headers.map((props, key) => {
            return (
              <CustomTableCell
                key={key}
                className={classNames(classes.columnWidth)}
              >
                {props}
              </CustomTableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(row => {
          return (
            <TableRow className={classes.row} key={row.id} hover={true}>
              <CustomTableCell
                component="th"
                className={classNames(classes.columnWidth, classes.columnRow)}
              >
                {row.order}
              </CustomTableCell>
              <CustomTableCell
                className={classNames(classes.columnWidth, classes.columnLabel)}
              >
                <Tooltip
                  title={row.optionLabel}
                  placement={"bottom"}
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Link to={"#"} onClick={() => onEditDialog(row)}>
                    {row.optionLabel}
                  </Link>
                </Tooltip>
              </CustomTableCell>
              <CustomTableCell
                numeric
                className={classNames(classes.columnWidth, classes.columnValue)}
              >
                {row.value}
              </CustomTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </React.Fragment>
  );
}

class GridOptions extends Component {
  state = {
    dialog: {
      isOpen: false,
      onEdit: {},
      buttonText: "",
      status: ""
    },
    data: [],
    showProgress: true,
    showDeleteDialog: false,
    dialogDelete: {
      data: [],
      isOpen: false,
      isSuccess: false
    }
  };

  actions = {
    getQuestionId: () => {
      const url = window.location.href.split("/");

      const questionId = url[url.length - 1];

      if (
        questionId.indexOf("formversion") > -1 &&
        questionId.indexOf("section") > -1
      ) {
        return "new";
      }

      if (questionId.indexOf("&newTab") > -1) {
        return questionId.split("?")[0];
      }

      return questionId;
    },
    handleClose: () => {
      this.setState(state => {
        return {
          ...state,
          dialog: {
            ...state.dialog,
            isOpen: false,
            onEdit: []
          }
        };
      });
    },
    handleOpen: () => {
      this.setState(state => {
        return {
          ...state,
          dialog: {
            ...state.dialog,
            isOpen: true,
            onEdit: {
              questionId: this.actions.getQuestionId()
            },
            buttonText: "Add New",
            status: "add"
          }
        };
      });
    },
    handleEditDialog: row => {
      this.setState(state => ({
        ...state,
        dialog: {
          ...state.dialog,
          isOpen: true,
          onEdit: row,
          buttonText: "Save Changes",
          status: "edit"
        }
      }));
    },
    handleOnTextChange: event => {
      this.setState(state => ({
        ...state,
        dialog: {
          ...state.dialog,
          onEdit: {
            ...state.dialog.onEdit,
            [event.id]: event.value
          }
        }
      }));
    },
    getAuthHeader: () => {
      return `Bearer ${localStorage.getItem("jwtToken")}`;
    },
    onDeleteOption: data => {
      this.dbCall.deleteOption(data.optionId);

      this.setState(state => {
        return {
          ...state,
          dialog: {
            ...state.dialog,
            isOpen: false,
            onEdit: []
          }
        };
      });
    },
    quickAdd: {
      showQuickAdd: () => {
        const responseTypeId = _.first(
          _.filter(this.props.dataValues.toJS(), {
            id: "responseTypeId"
          })
        ).value;

        api
          .get()
          .optionsSimpleQuickAdd(this.dbCall.getAuthHeader(), responseTypeId)
          .then(response => {
            this.setState(state => {
              return {
                ...state,
                dialog: {
                  ...state.dialog,
                  quickAdd: {
                    isOpen: true,
                    values: response
                  }
                }
              };
            });
          });
      },
      onCancelQuickAddDialog: () => {
        this.setState(state => {
          return {
            ...state,
            dialog: {
              ...state.dialog,
              quickAdd: {
                isOpen: false
              }
            }
          };
        });
      },
      onValueChange: event => {
        this.setState(state => {
          return {
            ...state,
            dialog: {
              ...state.dialog,
              quickAdd: {
                ...state.dialog.quickAdd,
                selectedValue: event.target.value
              }
            }
          };
        });
      },
      onAddOption: () => {
        const { selectedValue, values } = this.state.dialog.quickAdd;

        if (typeof selectedValue === "undefined") {
          return;
        }

        const options = _.first(
          _.filter(values, {
            groupId: parseInt(selectedValue, 10)
          })
        ).quickOptions;

        const questionId = this.actions.getQuestionId();

        let defaultValues = [];

        options.map(prop => {
          prop.questionId = questionId;
          defaultValues.push(prop);

          return prop;
        });

        api
          .insert()
          .questionOptions(this.dbCall.getAuthHeader(), defaultValues)
          .then(response => {
            this.setState(state => {
              return {
                ...state,
                data: List([...this.state.data, ...response.data]).sortBy(
                  option => {
                    return option.order;
                  }
                ),
                dialog: {
                  ...state.dialog,
                  quickAdd: {
                    isOpen: false
                  }
                }
              };
            });
          });
      }
    },
    onHideDeleteDialog: () => {
      this.setState(state => {
        return {
          ...state,
          dialogDelete: {
            isOpen: false
          }
        };
      });
    },
    onDeleteOptionResponse: data => {
      let actions = {};
      let isDeletionSuccess = false;

      const response = _.first(data).questionLabel;

      if (response === "Deleted") {
        let timer;

        const _that = this;

        this.showThenHideAlert = () => {
          window.clearTimeout(timer);

          timer = window.setTimeout(function() {
            _that.setState(state => {
              return {
                ...state,
                dialogDelete: {
                  isSuccess: false
                }
              };
            });
          }, 1500);
        };

        this.showThenHideAlert();

        actions = {
          isSuccess: true
        };

        isDeletionSuccess = true;
      } else {
        //------------------------------------
        //If Success

        actions = {
          isOpen: true,
          data: data
        };
      }

      this.setState(state => {
        return {
          ...state,
          dialogDelete: actions,
          showProgress: isDeletionSuccess,
          data: isDeletionSuccess ? [] : state.data
        };
      });

      if (isDeletionSuccess) {
        const _that = this;

        _.delay(function() {
          _that.dbCall.getOptions(_that.actions.getQuestionId());
        }, 300);
      }
    },
    handleOnInsertConflict: data => {
      if (data.errorId === 1) {
        this.actions.handleClose();

        const _that = this;

        _.delay(function() {
          _that.setState(state => {
            return {
              ...state,
              showOnInsertErrorMessage: (
                <span>
                  <b>Error: </b> {data.errorDescription}
                </span>
              ),
              showOnInsertError: true
            };
          });

          let timer;

          (_that => {
            window.clearTimeout(timer);

            timer = window.setTimeout(function() {
              _that.setState(state => {
                return {
                  ...state,
                  showOnInsertError: false
                };
              });
            }, 3000);
          })(_that);
        }, 400);
      }
    },
    handleOnInsertConfirmUpdate: data => {
      if (data.errorId === 2) {
        const inputs = _.cloneDeep(this.state.dialog.onEdit);

        this.actions.handleClose();

        const _that = this;

        _.delay(function() {
          _that.setState(state => {
            return {
              ...state,
              showDialogOptionConfirm: true,
              showDialogOptionConfirmMessage: data.errorDescription,
              confirmationNumber: data.confirmationNumber,
              confirmationData: inputs
            };
          });
        });
      }
    },
    handleOnDialogConfirmCancel: () => {
      this.setState(state => {
        return {
          ...state,
          showDialogOptionConfirm: false
        };
      });
    },
    handleOnDialogConfirmYes: () => {
      const inputs = _.cloneDeep(this.state.confirmationData);

      inputs.confirmationNumber = this.state.confirmationNumber;

      this.dbCall.handleOnUpdate(inputs);
    }
  };

  dbCall = {
    getAuthHeader: () => {
      return `Bearer ${localStorage.getItem("jwtToken")}`;
    },
    handleOnUpdate: confirmationData => {
      let inputs = _.cloneDeep(this.state.dialog.onEdit);

      if (_.isEmpty(inputs)) {
        inputs = confirmationData;
      }

      api
        .update()
        .questionOptions(this.dbCall.getAuthHeader(), inputs)
        .then(response => {
          if (response.status === 400) {
            const { data } = response;

            this.actions.handleOnInsertConfirmUpdate(data);

            this.actions.handleOnInsertConflict(data);

            return;
          }

          const stateData = _.cloneDeep(this.state.data.toJS());

          const freshOptions = _.first(response.data);

          stateData.splice(
            _.findIndex(stateData, { optionId: freshOptions.optionId }),
            1,
            freshOptions
          );

          this.setState(state => {
            return {
              ...state,
              data: List(stateData).sortBy(option => {
                return option.order;
              }),
              showDialogOptionConfirm: false
            };
          });

          this.actions.handleClose();
        });
    },
    handleOnInsertNew: () => {
      api
        .insert()
        .questionOption(this.dbCall.getAuthHeader(), {
          ...this.state.dialog.onEdit
        })
        .then(response => {
          if (response.status === 400) {
            const { data } = response;

            this.actions.handleOnInsertConflict(data);

            return;
          }

          this.setState(state => {
            return {
              ...state,
              data: List([...this.state.data, _.first(response.data)]).sortBy(
                option => {
                  return option.order;
                }
              )
            };
          });

          this.actions.handleClose();
        });
    },
    getOptions: questionId => {
      api
        .get()
        .questionOptions(
          this.actions.getAuthHeader(),
          questionId || this.actions.getQuestionId()
        )
        .then(data => {
          if (_.some(data)) {
            this.setState(state => ({
              ...state,
              showProgress: false,
              data: List(data)
            }));
          } else {
            this.setState(state => ({
              ...state,
              showProgress: false,
              data: []
            }));
          }
        });
    },
    deleteOption: optionId => {
      api
        .delete()
        .options(this.actions.getAuthHeader(), optionId)
        .then(data => {
          this.actions.onDeleteOptionResponse(data);
        });
    }
  };

  componentDidMount() {
    this.dbCall.getOptions(this.actions.getQuestionId());
  }

  render() {
    const { classes, isNewQuestion } = this.props;

    const hasData = _.some(this.state.data);

    return (
      <React.Fragment>
        <Card>
          <CardHeader color="primary">
            <p className={classes.cardCategoryWhite}>Options</p>
          </CardHeader>
          <CardBody>
            {this.state.showProgress ? (
              <CircularProgress
                className={classes.progress}
                size={50}
                style={{ color: purple[500], marginLeft: "45%" }}
                thickness={7}
              />
            ) : (
              <span>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    {hasData ? (
                      <CreateTableContents
                        {...this.props}
                        data={this.state.data}
                        onEditDialog={this.actions.handleEditDialog}
                      />
                    ) : (
                      <span />
                    )}
                  </Table>
                </Paper>
                {hasData ? (
                  <span />
                ) : isNewQuestion ? (
                  "Not available"
                ) : (
                  "No Record"
                )}
              </span>
            )}
          </CardBody>
          <Divider />
          <CardFooter style={{ display: "block" }}>
            <Button
              variant="flat"
              color="primary"
              size="small"
              disabled={hasData || isNewQuestion}
              className={classes.quickAdd}
              onClick={() => this.actions.quickAdd.showQuickAdd()}
            >
              <OfflineBolt className={classNames(classes.leftIcon)} />
              Quick Add
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              className={classes.button}
              onClick={() => this.actions.handleOpen()}
              disabled={isNewQuestion}
            >
              Add New
            </Button>
          </CardFooter>
        </Card>

        <OptionsDialog
          open={this.state.dialog.isOpen}
          onClose={this.actions.handleClose}
          data={this.state.dialog.onEdit}
          buttonText={this.state.dialog.buttonText}
          onTextChange={this.actions.handleOnTextChange}
          onUpdate={this.dbCall.handleOnUpdate}
          onInsertNew={this.dbCall.handleOnInsertNew}
          status={this.state.dialog.status}
          onDelete={this.actions.onDeleteOption}
          dialogDelete={this.state.dialogDelete}
          onHideDeleteDialog={this.actions.onHideDeleteDialog}
        />
        <Snackbar
          place="br"
          color="danger"
          icon={DeleteOutline}
          message={"Option deleted successfully"}
          open={this.state.dialogDelete.isSuccess}
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Warning}
          message={this.state.showOnInsertErrorMessage}
          open={this.state.showOnInsertError}
        />
        <GridOptionsDialogConfirm
          isOpen={this.state.showDialogOptionConfirm}
          message={this.state.showDialogOptionConfirmMessage}
          cancel={this.actions.handleOnDialogConfirmCancel}
          yes={this.actions.handleOnDialogConfirmYes}
        />
        <OptionsDialogQuickAdd
          state={this.state.dialog.quickAdd}
          actions={this.actions.quickAdd}
        />
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  },
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
  button: {
    float: "right"
  },
  tooltip: {
    fontSize: 15,
    maxWidth: "none"
  },
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 100
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  columnWidth: {
    padding: "4px 15px 4px 20px"
  },
  columnRow: {
    width: "5%"
  },
  columnLabel: {
    width: "75%"
  },
  columnValue: {
    width: "20%"
  },
  quickAdd: {
    position: "absolute",
    left: 0,
    marginLeft: "3%",
    padding: "5px"
  }
});

GridOptions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GridOptions);
