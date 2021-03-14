//npm
import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { List } from "immutable";

//components
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import CardFooter from "components/Internals/Card/CardFooter";

//material-ui
import Button from "@material-ui/core/Button/Button";
import Divider from "@material-ui/core/Divider/Divider";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Paper from "@material-ui/core/Paper/Paper";
import withStyles from "@material-ui/core/styles/withStyles";

//api
import api from "apis/index";
import purple from "@material-ui/core/es/colors/purple";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

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

const headers = ["Order", "Question Label", "Response Type", "Parent Option"];

function CreateTableContents({ classes, data, match }) {
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
        {data.map(row => {
          return (
            <TableRow className={classes.row} key={row.id} hover={true}>
              <CustomTableCell
                component="th"
                scope="row"
                style={{ width: "10px" }}
              >
                {row.order}
              </CustomTableCell>
              <CustomTableCell>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/sections/${
                      row.sectionId
                    }/questions/${row.questionId}`,
                    state: {
                      referer: "parent",
                      parentQuestionId: parseInt(match.params.id, 10)
                    }
                  }}
                >
                  {row.questionLabel}
                </Link>
              </CustomTableCell>
              <CustomTableCell style={{ width: "10px" }}>
                {row.responseType}
              </CustomTableCell>
              <CustomTableCell style={{ width: "10px" }}>
                {row.parentOption}
              </CustomTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </React.Fragment>
  );
}
class GridSubQuestion extends Component {
  state = {
    dialog: {
      isOpen: false,
      onEdit: {},
      buttonText: "",
      status: ""
    },
    data: [],
    showProgress: true
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
    getParentQuestionId: () => {
      const url = window.location.href.split("/");

      const questionId = url[url.length - 1];

      let updatedQuestionId = questionId;

      if (questionId.indexOf("&newTab") > -1) {
        updatedQuestionId = questionId.split("?")[0];
      }

      return `/questions/${updatedQuestionId}/new`;
    },
    getSectionId: () => {
      return commonAction.getSectionId();
    },
    getAuthHeader: () => {
      return `Bearer ${localStorage.getItem("jwtToken")}`;
    }
  };

  dbCall = {
    getSubQuestions: (questionId, sectionId) => {
      api
        .get()
        .questionSubQuestions(
          this.actions.getAuthHeader(),
          questionId || this.actions.getQuestionId(),
          sectionId
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
    }
  };

  componentDidMount() {
    this.dbCall.getSubQuestions(
      this.actions.getQuestionId(),
      this.props.sectionId
    );
  }

  render() {
    const {
      classes,
      match,
      isNewQuestion,
      onNewSubQuestion,
      showNewTemplateAlert
    } = this.props;

    // this.actions.updateStateIfNotEqual(subQuestions);

    const hasData = _.some(this.state.data);

    return (
      <React.Fragment>
        <Card>
          <CardHeader color="primary">
            <p className={classes.cardCategoryWhite}>Sub Questions</p>
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
                        classes={classes}
                        data={this.state.data}
                        match={match}
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
            <Link
              to={`${
                process.env.PUBLIC_URL
              }/sections/${this.actions.getSectionId()}${this.actions.getParentQuestionId()}`}
            >
              <Button
                variant="contained"
                size="small"
                color="primary"
                className={classes.button}
                onClick={() => {
                  onNewSubQuestion();
                  showNewTemplateAlert();
                }}
                disabled={isNewQuestion}
              >
                Add New
              </Button>
            </Link>
          </CardFooter>
        </Card>
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
  }
});

export default withRouter(withStyles(styles)(GridSubQuestion));
