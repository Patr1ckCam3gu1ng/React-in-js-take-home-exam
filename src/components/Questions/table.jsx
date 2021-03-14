//npm
import React from "react";
import dateFormat from "dateformat";
import * as PropTypes from "prop-types";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/Paper";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Table from "@material-ui/core/Table/Table";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

//components
import PaginationFooter from "components/Questions/tablepagination";
import QuestionRoute from "components/Questions/questionRoute";

//icons
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import HelpOutline from "@material-ui/icons/HelpOutline";

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

const headers = [
  "Order",
  "Question Label",
  "Parent Question",
  "Response Type",
  "Modified On"
];

class MasterTable extends React.Component {
  state = {
    page:
      new URL(window.location.href).searchParams.get("page") === null
        ? 0
        : parseInt(new URL(window.location.href).searchParams.get("page"), 10),
    rowsPerPage: 50
  };

  handleChangePage = (event, page) => {
    const { rowsPerPage } = this.state;
    const { data } = this.props;

    const pageItems = data.toJS().length - page * rowsPerPage;

    if (pageItems < rowsPerPage) {
      this.props.scrollTop();
    }

    this.actions.replacePagerUrl(page);

    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleOnCheckErrors = () => {
    this.props.onCheckErrors();
  };

  actions = {
    replacePagerUrl: page => {
      const urlLocation = new URL(window.location.href);

      const { origin, pathname, searchParams } = urlLocation;

      const names = {
        providers: "providers",
        forms: "forms",
        formversion: "formversion",
        section: "section"
      };

      const providerValue = searchParams.get(names.providers);
      const formValue = searchParams.get(names.forms);
      const formVersionValue = searchParams.get(names.formversion);
      const sectionValue = searchParams.get(names.section);

      const url = `${names.providers}=${providerValue}&${
        names.forms
      }=${formValue}&${names.formversion}=${formVersionValue}&${
        names.section
      }=${sectionValue}&${"page"}=${page}`;

      window.history.replaceState(null, null, `${origin + pathname}?&${url}`);
    },
    lessenColumnSizeWidth: key => {
      let style = {};

      if (key === 0) {
        style = {
          padding: 0,
          paddingLeft: "1%",
          width: "3.3%",
          fontSize: "12px"
        };
      }

      return style;
    },
    questionLabelContent: (row, onRedirect, rootUrl, returnUrl) => {
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
        onRedirect: onRedirect,
        rootUrl: rootUrl,
        returnUrl: returnUrl,
        showTitle: true
      };

      if (isQuestionHasLabel === true) {
        element = (
          <span style={{ marginLeft: tabs + "px" }}>
            <QuestionRoute {...props} secondaryTitle={row.label}>
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
                <QuestionRoute {...props} secondaryTitle={"HTML Content"}>
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
              onRedirect={onRedirect}
              rootUrl={rootUrl}
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
    }
  };

  render() {
    const { classes, data, onRedirect, rootUrl, returnUrl } = this.props;
    const { rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {headers.map((props, key) => {
                return (
                  <CustomTableCell
                    style={this.actions.lessenColumnSizeWidth(key)}
                    key={key}
                  >
                    {props}
                  </CustomTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                const element = this.actions.questionLabelContent(
                  row,
                  onRedirect,
                  rootUrl,
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
                      component="th"
                      scope="row"
                      padding={"checkbox"}
                      style={{ width: "50px" }}
                    >
                      {row.order}
                    </CustomTableCell>

                    <CustomTableCell>
                      {this.actions.getQuestionLabelColumn(
                        element,
                        classes,
                        row
                      )}
                    </CustomTableCell>

                    <CustomTableCell style={{ width: "35%" }}>
                      <QuestionRoute
                        id={row.parentQuestionId}
                        onRedirect={onRedirect}
                        title={row.parentOptionLabel}
                        showTitle={true}
                        rootUrl={rootUrl}
                        returnUrl={returnUrl}
                        secondaryTitle={row.parentQuestion}
                        responseGroupTitle={responseGroupTitle}
                        hasParentOption={true}
                        sectionId={row.sectionId}
                      >
                        {parentQuestion}
                      </QuestionRoute>
                    </CustomTableCell>

                    <CustomTableCell padding={"dense"} style={{ width: "1%" }}>
                      {row.responseType}
                    </CustomTableCell>

                    <CustomTableCell padding={"dense"} style={{ width: "13%" }}>
                      {row.updatedAt === null ? (
                        <span />
                      ) : (
                        dateFormat(row.updatedAt, "mmm-dd-yyyy, hh:MM TT")
                      )}
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <PaginationFooter
              count={data.toJS().length}
              page={page}
              rowsPerPage={rowsPerPage}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              filters={this.props.filters}
              onCheckErrors={this.handleOnCheckErrors}
            />
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

const styles = theme => ({
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
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    },
    "& a:hover,& a:focus": {
      fontSize: 13
    }
  }
});

MasterTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(MasterTable);
