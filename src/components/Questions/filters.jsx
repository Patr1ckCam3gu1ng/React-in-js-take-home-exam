import React from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";

// core components
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";

import CardBody from "components/Internals/Card/CardBody.jsx";
import CardFooter from "components/Internals/Card/CardFooter.jsx";
import MasterTable from "components/Questions/table";

// material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Input from "@material-ui/core/Input/Input";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

//views
import { QuestionConsumer } from "views/Questions";
import QuestionManage from "views/QuestionManage";

function QuestionFilters(props) {
  const fields = [
    {
      id: "providers",
      label: "Provider"
    },
    {
      id: "forms",
      label: "Form"
    },
    {
      id: "formversion",
      label: "Form Version"
    },
    {
      id: "section",
      label: "Section"
    }
  ];

  const { classes, match } = props;

  return (
    <QuestionConsumer>
      {({
        table,
        filters,
        actions,
        redirect,
        onRedirect,
        progressBar,
        scrollTop,
      }) => {
        return redirect ? (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Route
                path={`${match.url}/:id`}
                component={QuestionManage}
                exact={true}
              />
            </GridItem>
          </GridContainer>
        ) : (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Questions</h4>
                  <p className={classes.cardCategoryWhite}>
                    Complete the search filters
                  </p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    {fields.map((prop, key) => {
                      const getFiltersById = filters[prop.id];

                      if (typeof getFiltersById === "undefined") {
                        return <span key={key} />;
                      }

                      const { data, selectValue } = getFiltersById;

                      if (data.length === 0) {
                        return <span key={key} />;
                      }

                      const { onChange } = actions[prop.id];

                      return (
                        <GridItem xs={12} sm={12} md={3} key={key}>
                          <form className={classes.root} autoComplete="off">
                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor={prop.id}>
                                {prop.label}
                              </InputLabel>
                              <Select
                                value={selectValue}
                                onChange={e =>
                                  onChange(e.target, prop.id, match)
                                }
                                input={
                                  <Input
                                    name={prop.id}
                                    id={prop.id}
                                    className={classes.inputs}
                                  />
                                }
                              >
                                {data.map((selectProp, selectKey) => {
                                  return (
                                    <MenuItem
                                      key={selectKey}
                                      value={selectProp.id}
                                    >
                                      {selectProp.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </form>
                        </GridItem>
                      );
                    })}
                  </GridContainer>
                </CardBody>
                {progressBar ? (
                  <GridItem xs={12} sm={12} md={12}>
                    <LinearProgress
                      classes={{
                        colorPrimary: classes.colorPrimary,
                        barColorPrimary: classes.barColorPrimary
                      }}
                    />
                  </GridItem>
                ) : (
                  <span />
                )}
                <CardFooter>
                  {table.data.length === 0 ? (
                    <span />
                  ) : (
                    <MasterTable
                      filters={filters}
                      data={table.data}
                      onRedirect={onRedirect}
                      scrollTop={scrollTop}
                      onCheckErrors={actions.getSectionQuestionErrors}
                    />
                  )}
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        );
      }}
    </QuestionConsumer>
  );
}

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    width: "100%"
  },
  inputs: {
    fontSize: "14px",
    fontWeight: "bold"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  colorPrimary: {
    backgroundColor: "#f5cdff"
  },
  barColorPrimary: {
    backgroundColor: "#a742b9"
  }
});

export default withRouter(withStyles(styles)(QuestionFilters));
