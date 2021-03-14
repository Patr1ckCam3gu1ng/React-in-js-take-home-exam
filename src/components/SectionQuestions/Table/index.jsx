//npm
import React from "react";
import dateFormat from "dateformat";
import { List } from "immutable";
import _ from "lodash";

//material-ui
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

//table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";

//icons
import LinkOff from "@material-ui/icons/RemoveCircleOutline";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import SentimentVerySatisfied from "@material-ui/icons/SentimentVerySatisfied";
import HelpOutline from "@material-ui/icons/HelpOutline";

//internals
import tasksStyle from "assets/jss/material-dashboard-react/components/tasksStyle.jsx";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//my components
import PaginationFooter from "components/Questions/tablepagination";
import QuestionRoute from "components/Questions/questionRoute";
import ConfirmDialog from "components/SectionQuestions/ConfirmDialog";

//api
import api from "apis/index";

//common
import commonAction from "common/index";

const CustomTableCell = withStyles(() => ({
  head: {
    color: "#a13bb6",
    fontSize: 15
  },
  body: {
    fontSize: 12.5,
    maxWidth: "100px",
    minWidth: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}))(TableCell);

const Controls = withStyles(tasksStyle)(
  ({ classes, onDelete, questionId, sectionId }) => {
    return (
      <span onClick={() => onDelete(questionId, sectionId)}>
        <Tooltip
          id="unlink"
          title="Unlink Question from this Section"
          placement="top"
          classes={{ tooltip: classes.tooltip }}
        >
          <IconButton className={classes.tableActionButton}>
            <LinkOff
              className={classes.tableActionButtonIcon + " " + classes.edit}
              style={{ position: "absolute", color: "red" }}
            />
          </IconButton>
        </Tooltip>
      </span>
    );
  }
);

export default withStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  errorDiv: {
    background: "#ff002d0d"
  },
  iconButton: {
    padding: 0
  },
  iconButtonQuestionToolTip: {
    padding: 0
  },
  tooltip: {
    fontSize: 15,
    maxWidth: "none"
  },
  iconButtonSpan: {
    float: "right"
  },
  colorSwitchBase: {
    color: "#ffffff",
    "&$colorChecked": {
      color: "#ffd600",
      "& + $colorBar": {
        backgroundColor: "#ffd600"
      }
    }
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    },
    "& a:hover,& a:focus": {
      fontSize: 14
    }
  }
}))(
  class SectionQuestionTable extends React.Component {
    state = {
      order: "desc",
      orderBy: "createdAt",
      selected: [],
      page: 0,
      rowsPerPage: 50,
      datas: [],
      confirmDialog: {
        subQuestions: [],
        isOpen: false
      }
    };

    api = {
      deleteSelectedQuestion: (questionId, sectionId, forceDelete) => {
        api
          .delete()
          .sectionQuestionItem(
            this.actions.getAuthHeader(),
            questionId,
            sectionId,
            forceDelete
          )
          .then(response => {
            if (response.status === 400) {
              this.setState(state => ({
                ...state,
                confirmDialog: {
                  isOpen: true,
                  subQuestions: List(response.data),
                  parentQuestionId: questionId
                }
              }));

              return;
            }

            this.setState(state => ({
              ...state,
              table: {
                ...state.table,
                data: List(response.data)
              }
            }));
          });
      }
    };

    actions = {
      getAuthHeader: () => {
        return `Bearer ${localStorage.getItem("jwtToken")}`;
      },
      handleChangeRowsPerPage: event => {
        this.setState({ rowsPerPage: event.target.value });
      },
      handleOnCheckErrors: () => {
        const { formversion, section } = this.props.filters;

        commonAction.getSectionQuestionErrors(
          formversion.selectValue,
          section.selectValue,
          this
        );
      },
      showThenHideAlert: objectName => {
        let timer;

        (_that => {
          window.clearTimeout(timer);

          timer = window.setTimeout(function() {
            _that.setState(state => {
              return {
                ...state,
                [objectName]: false
              };
            });
          }, 1500);
        })(this);
      },
      handleChangePage: (event, page) => {
        const { rowsPerPage } = this.state;
        const { data } = this.props;

        const pageItems = data.toJS().length - page * rowsPerPage;

        if (pageItems < rowsPerPage) {
          this.props.scrollTop();
        }

        this.setState({ page });
      },
      onDelete: (questionId, sectionId) => {
        this.api.deleteSelectedQuestion(questionId, sectionId, "");
      },
      init: () => {
        const { nextPrevSections, data } = this.props;

        this.setState(state => ({
          ...state,
          table: {
            ...state.table,
            data: data
          },
          nextPrevSections: nextPrevSections
        }));
      },
      confirmDialog: {
        onClose: () => {
          this.setState(state => ({
            ...state,
            confirmDialog: {
              isOpen: false
            }
          }));
        },
        proceed: (parentQuestionId, sectionId) => {
          this.api.deleteSelectedQuestion(
            parentQuestionId,
            sectionId,
            "forceDelete"
          );

          this.actions.confirmDialog.onClose();
        }
      },
      questionLabelContent: (row, returnUrl) => {
        let index = 0;

        let tabs = 0;

        while (index < row.nestedCount) {
          tabs += 30;
          index++;
        }

        const isQuestionHasLabel = row.label !== null && row.label !== "";

        const isHtml = row.htmlContent !== null;

        let element = <span />;

        const props = {
          id: row.id,
          sectionId: row.sectionId,
          rootUrl: "questions",
          returnUrl: returnUrl
        };

        if (isQuestionHasLabel === true) {
          element = (
            <span style={{ marginLeft: tabs + "px" }}>
              <QuestionRoute
                {...props}
                secondaryTitle={row.label}
                showTitle={true}
              >
                {row.label === null
                  ? ""
                  : row.label.substring(0, 65) +
                    (row.label.length > 65 ? "..." : "")}
              </QuestionRoute>
            </span>
          );
        } else {
          if (isHtml === true) {
            element = (
              <span style={{ marginLeft: tabs + "px" }}>
                <i>
                  <QuestionRoute
                    {...props}
                    secondaryTitle={"HTML Content"}
                    showTitle={true}
                  >
                    {row.htmlContent === null
                      ? ""
                      : row.htmlContent.substring(0, 60) +
                        (row.htmlContent.length > 60 ? "..." : "")}
                  </QuestionRoute>
                </i>
              </span>
            );
          }
        }
        if (isQuestionHasLabel === false && isHtml === false) {
          element = (
            <span style={{ marginLeft: tabs + "px" }}>
              <QuestionRoute
                id={row.id}
                rootUrl={`questions`}
                returnUrl={returnUrl}
              >
                {"< Click to edit >"}
              </QuestionRoute>
            </span>
          );
        }

        return element;
      },
      questionParentLabelContent: row => {
        let text = "";

        if (row.parentQuestion !== null) {
          text = `${row.parentQuestionOrder}. ${row.parentQuestion.substring(
            0,
            65
          ) + (row.parentQuestion.length > 65 ? "..." : "")}`;
        }

        const parentQuestion = row.parentQuestionOrder === null ? "" : text;

        return parentQuestion;
      },
      getQuestionLabelColumn: (element, classes, row) => {
        if (typeof row.errors !== "undefined") {
          return (
            <div className={classes.errorDiv}>
              {element}
              <span className={classes.iconButtonSpan}>
                <Tooltip
                  title={row.errors.errorMessage}
                  placement={"right"}
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton color="secondary" className={classes.iconButton}>
                    <ErrorOutline />
                  </IconButton>
                </Tooltip>
              </span>
            </div>
          );
        }

        const questionTooltip =
          row.toolTip === "" || row.toolTip === null ? (
            <span />
          ) : (
            <Tooltip
              title={row.toolTip}
              placement={"right"}
              classes={{ tooltip: classes.tooltip }}
              style={{ marginLeft: "7px" }}
            >
              <IconButton
                color="default"
                className={classes.iconButtonQuestionToolTip}
              >
                <HelpOutline />
              </IconButton>
            </Tooltip>
          );

        return (
          <div>
            {element}
            {questionTooltip}
          </div>
        );
      },
      initOnChangeUrlSectionId: prevState => {
        if (typeof prevState.nextPrevSections !== "undefined") {
          if (
            _.isEqual(
              prevState.nextPrevSections.toJS(),
              this.props.nextPrevSections.toJS()
            ) === false
          ) {
            this.actions.init();
          }
        }
      },
      refreshQuestionTable: () => {



      }
    };

    componentDidMount() {
      this.actions.init();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      this.actions.initOnChangeUrlSectionId(prevState);
    }

    render() {
      const headers = [
        "Order",
        "Question Label",
        "Parent Question",
        "Response Type",
        "Modified On",
        ""
      ];

      const { classes, returnUrl, sectionId, filters } = this.props;

      const { rowsPerPage, page, table, confirmDialog } = this.state;

      if (typeof table === "undefined") {
        return <span />;
      }

      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {headers.map((props, key) => {
                  return <CustomTableCell key={key}>{props}</CustomTableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {table.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                  const element = this.actions.questionLabelContent(
                    row,
                    returnUrl
                  );

                  const parentQuestion = this.actions.questionParentLabelContent(
                    row
                  );

                  let responseGroupTitle = null;

                  if (row["parentResponseTypeId"] === 12 /*group*/) {
                    responseGroupTitle = "Response Group";
                  }

                  return (
                    <TableRow className={classes.row} key={row.id} hover={true}>
                      <CustomTableCell
                        padding={"checkbox"}
                        style={{ width: "1%" }}
                      >
                        {row.order}
                      </CustomTableCell>
                      <CustomTableCell
                        padding={"checkbox"}
                        style={{ width: "45%" }}
                      >
                        {this.actions.getQuestionLabelColumn(
                          element,
                          classes,
                          row
                        )}
                      </CustomTableCell>

                      <CustomTableCell style={{ width: "20%" }}>
                        <QuestionRoute
                          id={row.parentQuestionId}
                          title={row.parentOptionLabel}
                          showTitle={true}
                          rootUrl={`questions`}
                          returnUrl={returnUrl}
                          secondaryTitle={row.parentQuestion}
                          responseGroupTitle={responseGroupTitle}
                          hasParentOption={true}
                          sectionId={row.sectionId}
                        >
                          {parentQuestion}
                        </QuestionRoute>
                      </CustomTableCell>

                      <CustomTableCell
                        padding={"dense"}
                        style={{ width: "1%" }}
                      >
                        {row.responseType}
                      </CustomTableCell>
                      <CustomTableCell
                        padding={"dense"}
                        style={{ width: "15%" }}
                      >
                        {row.updatedAt === null ? (
                          <span />
                        ) : (
                          dateFormat(row.updatedAt, "mmm-dd-yyyy, hh:MM TT")
                        )}
                      </CustomTableCell>
                      <CustomTableCell
                        padding={"dense"}
                        style={{ width: "1%" }}
                      >
                        <Controls
                          questionId={row.id}
                          sectionId={sectionId}
                          onDelete={this.actions.onDelete}
                        />
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <PaginationFooter
                count={table.data.toJS().length}
                page={page}
                rowsPerPage={rowsPerPage}
                onChangePage={this.actions.handleChangePage}
                onChangeRowsPerPage={this.actions.handleChangeRowsPerPage}
                filters={filters}
                onCheckErrors={this.actions.handleOnCheckErrors}
              />
            </TableFooter>
          </Table>
          <ConfirmDialog
            data={confirmDialog}
            actions={this.actions.confirmDialog}
            sectionId={sectionId}
          />
          <Snackbar
            place="br"
            color="success"
            icon={SentimentVerySatisfied}
            message={
              <span>
                Hooray! <b>No errors</b> were found.
              </span>
            }
            open={this.state.showNoErrors}
          />
        </Paper>
      );
    }
  }
);
