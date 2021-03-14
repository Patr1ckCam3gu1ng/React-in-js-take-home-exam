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
import Button from "@material-ui/core/Button";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";

//internals
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";

//internals grids
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//api
import api from "apis/index";
// import { Map } from "immutable/dist/immutable";

export default withStyles(theme => ({
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
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: "bold",
    color: "#8e24aa"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
}))(
  class FormVersionTable extends React.Component {
    actions = {
      getAuthHeader: () => {
        return `Bearer ${localStorage.getItem("jwtToken")}`;
      },
      getFormIdFromUrl: () => {
        const url = window.location.href.split("/");

        const questionId = url[url.length - 1];

        return questionId;
      }
    };

    api = {
      getInitialDetails: () => {
        api
          .get()
          .formVersionsComplexByFormId(
            this.actions.getAuthHeader(),
            this.actions.getFormIdFromUrl()
          )
          .then(response => {
            this.setState(state => {
              return {
                ...state,
                data: List(response)
              };
            });
          });
      },
      getFormDetails: () => {
        api
          .get()
          .formsById(
            this.actions.getAuthHeader(),
            this.actions.getFormIdFromUrl()
          )
          .then(response => {
            if (response.result.formId !== null) {
              this.api.getInitialDetails();
            }
          });
      }
    };

    componentDidMount() {
      this.api.getFormDetails();
    }

    render() {
      if (this.state === null) {
        return <div />;
      }

      const headers = [
        "Version Number",
        "Valid From",
        "Valid To",
        "PDF Type",
        "Signature Type",
        "Status"
      ];

      const { classes } = this.props;

      const { data } = this.state;

      return (
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Form Versions</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem md={12}>
                <Paper className={classes.root}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headers.map((props, key) => {
                          return (
                            <CustomTableCell key={key}>{props}</CustomTableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row, key) => {
                        return (
                          <TableRow
                            className={classes.row}
                            key={key}
                            hover={true}
                          >
                            <CustomTableCell className={classes.formName}>
                              <Link
                                to={{
                                  pathname: `${process.env.PUBLIC_URL}/forms/${
                                    row.formId
                                  }/formversions/${row.formVersionId}`
                                }}
                              >
                                {row.versionNumber}
                              </Link>
                            </CustomTableCell>

                            <CustomTableCell className={classes.typeName}>
                              {row.validFrom}
                            </CustomTableCell>

                            <CustomTableCell className={classes.typeName}>
                              {row.validTo}
                            </CustomTableCell>

                            <CustomTableCell className={classes.typeName}>
                              {row.pdfTypeName}
                            </CustomTableCell>

                            <CustomTableCell className={classes.typeName}>
                              {row.signatureTypeName}
                            </CustomTableCell>

                            <CustomTableCell className={classes.typeName}>
                              {row.formVersionStatusName}
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
                        <CustomTableCell />
                        <CustomTableCell>
                          <Link
                            to={{
                              pathname: `${
                                process.env.PUBLIC_URL
                              }/forms/${this.actions.getFormIdFromUrl()}/formversions/0`
                            }}
                          >
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
                  </Table>
                </Paper>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      );
    }
  }
);
