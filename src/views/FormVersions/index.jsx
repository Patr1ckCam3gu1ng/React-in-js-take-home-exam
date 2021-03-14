//npm
import React, { Component } from "react";
import { withRouter } from "react-router";
import withStyles from "@material-ui/core/styles/withStyles";
import { List, Map } from "immutable";

//internals
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//material
import Divider from "@material-ui/core/Divider/Divider";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

//icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//my components
import FormVersionInputs from "components/FormVersions";
import FormBenefitTable from "components/FormBenefits/Table";
import FormSectionTable from "components/FormSections/Table";
import FormAdviserTable from "components/FormAdviser/Table";

//api
import api from "apis/index";

function CollapsiblePanel({ component, label, classes }) {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{label}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Paper className={classes.root}>
          <Table className={classes.table}>{component}</Table>
        </Paper>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

function Progress({ classes }) {
  return (
    <LinearProgress
      classes={{
        colorPrimary: classes.colorPrimary,
        barColorPrimary: classes.barColorPrimary
      }}
      style={{ marginTop: "25%" }}
    />
  );
}

export default withRouter(
  withStyles(theme => ({
    table: {
      minWidth: 100
    },
    root: {
      width: "100%",
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto"
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: "bold",
      color: "#8e24aa"
    },
    colorPrimary: {
      backgroundColor: "#f5cdff"
    },
    barColorPrimary: {
      backgroundColor: "#a742b9"
    }
  }))(
    class FormVerion extends Component {
      state = [];

      actions = {
        getFormVersionIdFromUrl: () => {
          const url = window.location.href.split("/");

          const formVersionId = url[url.length - 1];

          return formVersionId;
        },
        getFormIdFromUrl: () => {
          const url = window.location.href.split("/");

          const formId = url[url.length - 3];

          return formId;
        }
      };

      api = {
        getDetails: () => {
          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          const formVersionId = this.actions.getFormVersionIdFromUrl();

          const formId = this.actions.getFormIdFromUrl();

          api
            .get()
            .formVersionAllDetails(jwt, formId, formVersionId)
            .then(response => {
              this.setState(state => {
                return {
                  ...state,
                  data: {
                    formVersions: Map(response.formVersions),
                    formVersionSelects: List(response.formVersionSelects),
                    formBenefits: List(response.formBenefits),
                    formVersionSections: List(response.formVersionSections),
                    formAdviser: List(response.adviserDetails)
                  }
                };
              });
            });
        }
      };

      componentDidMount() {
        this.api.getDetails();
      }

      render() {
        const { classes } = this.props;

        if (typeof this.state.data === "undefined") {
          return <Progress classes={classes} />;
        }

        const {
          formVersions,
          formVersionSelects,
          formBenefits,
          formVersionSections,
          formAdviser
        } = this.state.data;

        const frmVersion = formVersions.toJS();

        const frmVersionDetails = {
          providerName: frmVersion["providerName"],
          formName: frmVersion["formName"],
          versionNumber: frmVersion["versionNumber"],
          formVersionId: frmVersion["formVersionId"]
        };

        const collapsiblePanels =
          this.actions.getFormVersionIdFromUrl() === "0" ? (
            <div />
          ) : (
            <React.Fragment>
              <GridItem xs={12} sm={12} md={12}>
                <CollapsiblePanel
                  component={<FormBenefitTable data={formBenefits} />}
                  label={"Applicable Benefits for this Form"}
                  classes={classes}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Divider light={true} style={{ marginTop: "1%" }} />
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <CollapsiblePanel
                  component={
                    <FormSectionTable
                      data={formVersionSections}
                      frmVersionDetails={frmVersionDetails}
                    />
                  }
                  label={"Sections"}
                  classes={classes}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Divider light={true} style={{ marginTop: "1%" }} />
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <CollapsiblePanel
                  component={<FormAdviserTable data={formAdviser} />}
                  label={"Adviser Details"}
                  classes={classes}
                />
              </GridItem>
            </React.Fragment>
          );

        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <FormVersionInputs
                data={formVersions}
                selects={formVersionSelects}
              />
            </GridItem>
            {collapsiblePanels}
          </GridContainer>
        );
      }
    }
  )
);
