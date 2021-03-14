//npm
import React from "react";
import * as PropTypes from "prop-types";

//material-ui
import IconButton from "@material-ui/core/IconButton/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button/Button";

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

class PaginationFooter extends React.Component {
  render() {
    const {
      classes,
      count,
      onChangePage,
      onChangeRowsPerPage,
      page,
      rowsPerPage,
      filters,
      onCheckErrors
    } = this.props;

    // function getFilterValues() {
    //   const filterArr = _.map(filters, function(value, prop) {
    //     return { [prop]: value.selectValue };
    //   });
    //
    //   return filterArr;
    // }

    let rowsPerPageList = [25, 50, 100];

    if (count > 100) {
      rowsPerPageList = [...rowsPerPageList, count];
    }

    if (typeof filters["formversion"] === "undefined") {
      return <div />;
    }

    const sectionId = filters["section"].selectValue;

    const params = `&formversion=${
      filters["formversion"].selectValue
    }&section=${sectionId}`;

    return (
      <TableRow>
        <TablePagination
          colSpan={4}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          ActionsComponent={TablePaginationActionsWrapped}
          className={classes.pagination}
          rowsPerPageOptions={rowsPerPageList}
        />
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          className={classes.errorButton}
          onClick={() => onCheckErrors()}
        >
          Find Errors
        </Button>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          className={classes.button}
          onClick={() =>
            window.open(
              `${
                process.env.PUBLIC_URL
              }/sections/${sectionId}/questions/new?${params}`,
              "_blank"
            )
          }
        >
          Add New
        </Button>
      </TableRow>
    );
  }
}

const styles = () => ({
  button: {
    margin: "15px 10px 15px 5px",
    float: "right"
  },
  errorButton: {
    marginTop: "16px"
  },
  pagination: {
    paddingRight: "30%"
  }
});

PaginationFooter.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onCheckErrors: PropTypes.func.isRequired
};

export default withStyles(styles)(PaginationFooter);
