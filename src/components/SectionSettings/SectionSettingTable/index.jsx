//npm
import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

//material-ui
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Button from "@material-ui/core/Button/Button";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";

export default withStyles(theme => ({
  tableRow: {
    width: "1000px"
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
}))(function({ classes, data, section }) {
  const headers = [
    "Applicability",
    "Client Type",
    "Product Option",
    "Gender",
    "Benefit",
    "Accelerated",
    "Occ Type",
    "Occ Class"
  ];
  const sectionInfo = section.toJS();

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
              <CustomTableCell>
                <Link
                  to={`${process.env.PUBLIC_URL}/forms/${
                    sectionInfo.formId
                  }/formversions/${sectionInfo.formVersionId}/sections/${
                    sectionInfo.sectionId
                  }/sectionSettings/${row.sectionSettingId}`}
                >
                  {row.applicabilityName}
                </Link>
              </CustomTableCell>
              <CustomTableCell>{row.clientTypeName}</CustomTableCell>
              <CustomTableCell>{row.productOption}</CustomTableCell>
              <CustomTableCell>{row.gender}</CustomTableCell>
              <CustomTableCell>{row.benefitName}</CustomTableCell>
              <CustomTableCell>{row.accelerated}</CustomTableCell>
              <CustomTableCell>{row.occTypeName}</CustomTableCell>
              <CustomTableCell>{row.occClass}</CustomTableCell>
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
          <CustomTableCell />
          <CustomTableCell>
            <Link
              to={`${process.env.PUBLIC_URL}/forms/${
                sectionInfo.formId
              }/formversions/${sectionInfo.formVersionId}/sections/${
                sectionInfo.sectionId
              }/sectionSettings/0`}
            >
              {" "}
              <Button
                variant="outlined"
                size="small"
                color="primary"
                className={classes.button}
              >
                Add New
              </Button>
            </Link>
          </CustomTableCell>
        </TableRow>
      </TableFooter>
    </React.Fragment>
  );
});
