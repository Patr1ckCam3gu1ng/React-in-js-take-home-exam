//npm
import React from "react";
import { Link } from "react-router-dom";
import { List } from "immutable";

//material-ui table
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";

//api
import api from "apis/index";

export default withStyles(theme => ({
  providerName: {
    width: "15%"
  },
  typeName: {
    width: "15%"
  },
  formName: {
    width: "60%"
  },
  statusName: {
    width: "20%"
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
    margin: "5px",
    float: "right"
  }
}))(
  class FormsTable extends React.Component {
    actions = {
      getAuthHeader: () => {
        return `Bearer ${localStorage.getItem("jwtToken")}`;
      }
    };

    api = {
      getInitialDetails: () => {
        api
          .get()
          .formsArchived(this.actions.getAuthHeader())
          .then(response => {
            this.setState(state => {
              return {
                ...state,
                data: List(response)
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

      const headers = ["Provider", "Type", "Form Name", "Status"];

      const { classes } = this.props;

      const { data } = this.state;

      return (
        <Paper className={classes.root}>
          <Table>
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
                  <TableRow className={classes.row} key={key} hover={true}>
                    <CustomTableCell className={classes.providerName}>
                      {row.providerName}
                    </CustomTableCell>
                    <CustomTableCell className={classes.typeName}>
                      {row.formTypeName}
                    </CustomTableCell>
                    <CustomTableCell className={classes.formName}>
                      <Link
                        to={{
                          pathname: `${process.env.PUBLIC_URL}/forms/${
                            row.formId
                          }`
                        }}
                      >
                        {row.formName}
                      </Link>
                    </CustomTableCell>
                    <CustomTableCell className={classes.statusName}>
                      {row.formStatusName}
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>

              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      );
    }
  }
);
