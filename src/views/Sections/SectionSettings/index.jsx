//npm
import React from "react";
import { withRouter } from "react-router";

//internals
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider/Divider";

//my components
import SectionSettingInputs from "components/SectionSettings/Main";
import SectionBenefitTable from "components/SectionSettings/SectionBenefitTable";

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
  }))(function() {
    const actions = {
      getSectionSettingIdFromUrl: () => {
        const url = window.location.href.split("/");

        const questionId = url[url.length - 1];

        return parseInt(questionId, 10);
      }
    };

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <SectionSettingInputs />
        </GridItem>
        <Divider light={true} style={{ marginTop: "1%" }} />
        <GridItem xs={12} sm={12} md={12}>
          {actions.getSectionSettingIdFromUrl() === 0 ? (
            <div />
          ) : (
            <SectionBenefitTable />
          )}
        </GridItem>
      </GridContainer>
    );
  })
);
