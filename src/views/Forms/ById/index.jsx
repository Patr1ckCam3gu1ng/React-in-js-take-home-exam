//npm
import React from "react";
import { withRouter } from "react-router";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider/Divider";

//my components
import Inputs from "components/Forms/Main";
import FormVersionsTable from "components/FormVersions/Table";

export default withRouter(
  withStyles(() => ({
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    }
  }))(function() {
    return (
      <React.Fragment>
        <Inputs />
        <Divider light={true} />
        <div style={{ marginTop: "3%" }}>
          <FormVersionsTable />
        </div>
      </React.Fragment>
    );
  })
);
