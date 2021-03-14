//npm
import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

//material-ui
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";

export default withRouter(
  withStyles(theme => ({
    tableRow: {
      width: "1000px"
    },
    sectionOrder: {
      width: "2%"
    },
    name: {
      width: "28%"
    },
    displayName: {
      width: "15%"
    },
    description: {
      width: "40%"
    },
    frequency: {
      width: "10%"
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
  }))(function({ classes, data, frmVersionDetails, history }) {
    const headers = [
      "Order",
      "Name",
      "Display Name",
      "Description",
      "Frequency"
    ];

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
                <CustomTableCell className={classes.sectionOrder}>
                  {row.sectionOrder}
                </CustomTableCell>
                <CustomTableCell className={classes.name}>
                  <Link
                    to={`${history.location.pathname}/sections/${
                      row.sectionId
                    }`}
                  >
                    {row.sectionName}
                  </Link>
                </CustomTableCell>
                <CustomTableCell className={classes.displayName}>
                  {row.displayName}
                </CustomTableCell>
                <CustomTableCell className={classes.description}>
                  {row.description}
                </CustomTableCell>
                <CustomTableCell className={classes.frequency}>
                  {row.frequency}
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
            <CustomTableCell />
            <CustomTableCell>
              {/*<Link*/}
                {/*to={{*/}
                  {/*pathname: `${history.location.pathname}/sections/${*/}
                    {/*data.toJS()[0]["sectionId"]*/}
                  {/*}/new`,*/}
                  {/*state: {*/}
                    {/*frmVersionDetails*/}
                  {/*}*/}
                {/*}}*/}
              {/*>*/}
                {/*<Button*/}
                  {/*variant="outlined"*/}
                  {/*size="small"*/}
                  {/*color="primary"*/}
                  {/*className={classes.button}*/}
                {/*>*/}
                  {/*Add New*/}
                {/*</Button>*/}
              {/*</Link>*/}
            </CustomTableCell>
          </TableRow>
        </TableFooter>
      </React.Fragment>
    );
  })
);
