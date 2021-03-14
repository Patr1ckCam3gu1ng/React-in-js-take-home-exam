//npm
import React, { Component } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { List } from "immutable";
import _ from "lodash";

//material-ui
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Button from "@material-ui/core/Button/Button";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import Table from "@material-ui/core/Table";

//internals
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import Paper from "@material-ui/core/Paper/Paper";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//internals grids
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//my components
import { CustomTableCell } from "assets/jss/customTableCell";
import SectionBenefitDialog from "components/SectionSettings/SectionBenefitTable/Dialog";

//icons
import Save from "@material-ui/icons/Save";

//api
import api from "apis/index";

//common
import commonAction from "common/index";

export default withStyles((theme) => ({
  tableRow: {
    width: "1000px",
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
  button: {
    margin: "5px",
    float: "right",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
}))(
  class SectionBenefitTable extends Component {
    actions = {
      getAuthHeader: () => {
        return `Bearer ${localStorage.getItem("jwtToken")}`;
      },
      getSectionSettingIdFromUrl: () => {
        const url = window.location.href.split("/");

        const questionId = url[url.length - 1];

        return questionId;
      },
      getSectionIdFromUrl: () => {
        return commonAction.getSectionId();
      },
      showSuccess: () => {
        this.setState((state) => {
          return {
            ...state,
            showAlert: true,
          };
        });

        let timer;

        const _that = this;

        this.showThenHideAlert = () => {
          window.clearTimeout(timer);

          timer = window.setTimeout(function () {
            _that.setState((state) => {
              return {
                ...state,
                showAlert: false,
              };
            });
          }, 1000);
        };

        this.showThenHideAlert();
      },
      dialog: {
        editDialog: (sectionBenefitId) => {
          api
            .get()
            .sectionBenefitByBenefitId(
              this.actions.getAuthHeader(),
              sectionBenefitId
            )
            .then((response) => {
              this.setState((state) => ({
                ...state,
                isOpen: true,
                dialogData: response,
              }));
            });
        },
        onClose: () => {
          this.setState((state) => ({
            ...state,
            isOpen: false,
          }));
        },
        onChange: (event) => {
          const { name, value } = event.target;

          this.setState((state) => ({
            ...state,
            dialogData: {
              ...state.dialogData,
              sectionBenefit: {
                ...state.dialogData.sectionBenefit,
                [name]: value,
              },
            },
          }));
        },
        onSave: () => {
          const input = this.state.dialogData.sectionBenefit;

          api
            .update()
            .sectionBenefitByBenefitId(this.actions.getAuthHeader(), input)
            .then((response) => {
              this.actions.showSuccess();

              this.setState((state) => ({
                ...state,
                data: List(response.data),
                isOpen: false,
              }));
            });
        },
        onInsertNew: () => {
          const input = _.cloneDeep(this.state.dialogData.sectionBenefit);

          input.sectionSettingId = this.actions.getSectionSettingIdFromUrl();

          api
            .insert()
            .sectionBenefitByBenefitId(this.actions.getAuthHeader(), input)
            .then((response) => {
              this.actions.showSuccess();

              this.setState((state) => ({
                ...state,
                data: List(response.data),
                isOpen: false,
              }));
            });
        },
      },
    };

    api = {
      getRecordList: () => {
        api
          .get()
          .sectionBenefitBySectionId(
            this.actions.getAuthHeader(),
            this.actions.getSectionSettingIdFromUrl()
          )
          .then((response) => {
            this.setState(() => {
              return {
                data: List(response),
              };
            });
          });
      },
      getSectionSettingById: () => {
        api
          .get()
          .sectionSettingById(
            this.actions.getAuthHeader(),
            this.actions.getSectionIdFromUrl(),
            this.actions.getSectionSettingIdFromUrl()
          )
          .then((response) => {
            if (response.applicability === 1) {
              this.api.getRecordList();
            }
          });
      },
    };

    componentDidMount() {
      this.api.getSectionSettingById();
    }

    render() {
      const headers = [
        "Benefit Name",
        "Accelerated",
        "Occupation Type",
        "Occupation Class",
        "TPD Add-On",
      ];

      if (this.state === null) {
        return <div />;
      }
      const { classes } = this.props;
      const { data } = this.state;

      return (
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              <b>{"Specific Benefits for this Section"}</b>
            </h4>
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
                            className={classNames(
                              classes.row,
                              classes.tableRow
                            )}
                            key={key}
                            hover={true}
                          >
                            <CustomTableCell>
                              <Link
                                onClick={() =>
                                  this.actions.dialog.editDialog(
                                    row.sectionBenefitId
                                  )
                                }
                                to={`#`}
                              >
                                {row.benefitName}
                              </Link>
                            </CustomTableCell>
                            <CustomTableCell>
                              {row.acceleratedName}
                            </CustomTableCell>
                            <CustomTableCell>{row.occTypeName}</CustomTableCell>
                            <CustomTableCell>{row.occClass}</CustomTableCell>
                            <CustomTableCell>
                              {row.tpdAddOnName}
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
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                              return this.actions.dialog.editDialog(0);
                            }}
                          >
                            Add New
                          </Button>
                        </CustomTableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Paper>
              </GridItem>
              <GridItem md={1} />
            </GridContainer>
            <SectionBenefitDialog
              isOpen={this.state.isOpen}
              actions={this.actions.dialog}
              data={this.state.dialogData}
            />
            <Snackbar
              place="br"
              color="success"
              icon={Save}
              message={
                <span>
                  <b>Success!</b> Saved successfully
                </span>
              }
              open={this.state.showAlert}
            />
          </CardBody>
        </Card>
      );
    }
  }
);
