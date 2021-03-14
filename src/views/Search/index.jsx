//npm
import React from "react";
import { withRouter } from "react-router";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";

//internals
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";

//internals
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//components
import Search from "components/Search";

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
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            <b>Search Question</b>
          </h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem md={1} />
            <GridItem md={10}>
              <Search />
            </GridItem>
            <GridItem md={1} />
          </GridContainer>
        </CardBody>
      </Card>
    );
  })
);
