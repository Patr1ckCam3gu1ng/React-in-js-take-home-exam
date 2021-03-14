//npm
import React from "react";
import { withRouter } from "react-router";

//internals
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//internals
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider/Divider";

//my components
import FormsTable from "components/Forms/Table";
import FormsArchived from "components/Forms/Archived";

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
  }))(function({ classes }) {
    return (
      <React.Fragment>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              <b>Forms</b>
            </h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem md={12}>
                <FormsTable />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
        <Divider light={true} style={{ margin: "2%" }} />

        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              <b>Archived Forms</b>
            </h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem md={12}>
                <FormsArchived />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  })
);
