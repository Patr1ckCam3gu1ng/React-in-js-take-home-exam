//npm
import React, { Component } from "react";
import { withRouter } from "react-router";
import { List, Map } from "immutable";
import _ from "lodash";

//internals
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import SentimentVerySatisfied from "@material-ui/icons/SentimentVerySatisfied";

//my components
import Sections from "components/FormSections/Main";
import SectionBenefitTable from "components/SectionSettings/SectionSettingTable";
import SectionQuestionTable from "components/SectionQuestions/Table";
import SectionQuestionHeadings from "components/SectionQuestionHeadings/Table";

//api
import api from "apis/index";

//common
import hubs from "hubs/index";

function CollapsePanel({ component, label, classes, noPaper }) {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{label}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {typeof noPaper === "undefined" ? (
          <Table className={classes.table}>{component}</Table>
        ) : (
          <Paper className={classes.root}>
            <Table className={classes.table}>{component}</Table>
          </Paper>
        )}
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
    class SectionView extends Component {
      state = {
        heading: {
          dialog: false,
          success: false
        },
        delete: {
          message: "",
          isOpen: false
        }
      };

      action = {
        showThenHideAlert: () => {
          this.setState(state => {
            return {
              ...state,
              heading: {
                ...state.heading,
                success: true
              }
            };
          });

          let timer;

          (_that => {
            window.clearTimeout(timer);

            timer = window.setTimeout(function() {
              _that.setState(state => {
                return {
                  ...state,
                  heading: {
                    ...state.heading,
                    success: false
                  }
                };
              });
            }, 2000);
          })(this);
        },
        onChangeHeadingLabel: event => {
          const value = event.target.value;

          this.setState(state => {
            return {
              ...state,
              heading: {
                ...state.heading,
                selected: {
                  ...state.heading.selected,
                  label: value
                }
              }
            };
          });
        },
        toggleDialog: data => {
          this.setState(state => {
            return {
              ...state,
              heading: {
                ...state.heading,
                dialog: !state.heading.dialog,
                selected: data
              }
            };
          });
        },
        getSectionId: () => {
          const url = window.location.href.split("/");

          const sectionId = url[url.length - 1];

          return sectionId;
        },
        refreshOnPrevNextSection: () => {
          this.api.getDetails();
        },
        registerHubOnQuestionDelete: () => {
          const { start, connection } = hubs.connect("deleteQuestion");

          const _that = this;

          start().then(() => {
            connection.on("RefreshQuestionListOnDelete", function() {
              const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

              const sectionId = _that.action.getSectionId();

              api
                .get()
                .sectionBySectionId(jwt, sectionId)
                .then(response => {
                  _that.setState(state => {
                    return {
                      ...state,
                      data: {
                        ...state.data,
                        sectionQuestions: List(response.sectionQuestions),
                        sectionQuestionsKey: _that.action.hashString(
                          response.sectionQuestions
                        )
                      }
                    };
                  });
                });
            });
          });
        },
        hashString: json => {
          const str = JSON.stringify(json);

          let hash = 0;
          let i;
          let chr;

          if (str.length === 0) return hash;
          for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
          }

          return Math.abs(hash);
        },
        questionHeadingSuccessInsertUpdate: response => {
          this.action.showThenHideAlert();

          this.setState(state => {
            return {
              ...state,
              data: {
                ...state.data,
                questionHeadings: List(response.data)
              },
              heading: {
                ...state.heading,
                dialog: false
              }
            };
          });
        },
        toggleConfirmDialog: () => {
          this.setState(state => {
            return {
              ...state,
              delete: {
                ...state.delete,
                isOpen: !state.delete.isOpen
              }
            };
          });
        }
      };

      api = {
        deleteQuestionHeadingForced: () => {
          const record = _.cloneDeep(this.state.delete.record);

          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          const sectionId = this.action.getSectionId();

          api
            .delete()
            .questionHeadingById(jwt, sectionId, record, true)
            .then(response => {
              this.action.toggleConfirmDialog();

              this.action.questionHeadingSuccessInsertUpdate(response);
            });
        },
        deleteQuestionHeading: record => {
          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          const sectionId = this.action.getSectionId();

          api
            .delete()
            .questionHeadingById(jwt, sectionId, record, false)
            .then(response => {
              const errorMessage = response.data.errorMessage;

              if (typeof errorMessage === "undefined") {
                this.action.questionHeadingSuccessInsertUpdate(response);
              } else {
                this.setState(state => {
                  return {
                    ...state,
                    delete: {
                      ...state.delete,
                      message: errorMessage,
                      isOpen: true,
                      record: record
                    }
                  };
                });
              }
            });
        },
        insertNewQuestionHeading: () => {
          const data = { ...this.state.heading.selected };

          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          const sectionId = this.action.getSectionId();

          api
            .insert()
            .questionHeadingById(jwt, sectionId, data)
            .then(response => {
              this.action.questionHeadingSuccessInsertUpdate(response);
            });
        },
        updateQuestionHeading: () => {
          const data = { ...this.state.heading.selected };

          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          const sectionId = this.action.getSectionId();

          api
            .update()
            .questionHeadingById(jwt, sectionId, data)
            .then(response => {
              this.action.questionHeadingSuccessInsertUpdate(response);
            });
        },
        getDetails: () => {
          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          const sectionId = this.action.getSectionId();

          api
            .get()
            .sectionBySectionId(jwt, sectionId)
            .then(response => {
              this.setState(state => {
                return {
                  ...state,
                  data: {
                    section: Map(response.section),
                    selects: List(response.sectionSelects),
                    sectionBenefits: List(response.sectionBenefits),
                    sectionQuestions: List(response.sectionQuestions),
                    nextPrevSections: Map(response.nextPrevSections),
                    sectionQuestionsKey: this.action.hashString(
                      response.sectionQuestions
                    ),
                    questionHeadings: List(response.questionHeadings)
                  }
                };
              });
            });
        }
      };

      componentDidMount() {
        this.api.getDetails();

        this.action.registerHubOnQuestionDelete();
      }

      render() {
        const { classes, scrollTop, match } = this.props;

        const isInsertNew = this.action.getSectionId() === "new";

        if (typeof this.state.data === "undefined") {
          return <Progress classes={classes} />;
        }

        const {
          section,
          selects,
          sectionBenefits,
          sectionQuestions,
          nextPrevSections,
          sectionQuestionsKey,
          questionHeadings
        } = this.state.data;

        const sectionId = this.action.getSectionId();

        const filters = {
          formversion: { selectValue: section.toJS()["formVersionId"] },
          section: { selectValue: section.toJS()["sectionId"] }
        };

        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Sections
                data={section}
                selects={selects}
                isInsertNew={isInsertNew}
                nextPrevSections={nextPrevSections}
                onPrevNextSection={this.action.refreshOnPrevNextSection}
              />
            </GridItem>
            <Divider light={true} style={{ marginTop: "1%" }} />

            {isInsertNew ? (
              <div />
            ) : (
              <React.Fragment>
                <GridItem xs={12} sm={12} md={12}>
                  <CollapsePanel
                    component={
                      <SectionBenefitTable
                        data={sectionBenefits}
                        section={section}
                      />
                    }
                    label={"Section Settings / Benefits"}
                    classes={classes}
                    noPaper={true}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Divider light={true} style={{ marginTop: "1%" }} />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CollapsePanel
                    component={
                      <SectionQuestionTable
                        data={sectionQuestions}
                        scrollTop={scrollTop}
                        returnUrl={`${match.url}/${sectionId}`}
                        sectionId={sectionId}
                        filters={filters}
                        nextPrevSections={nextPrevSections}
                        key={sectionQuestionsKey}
                      />
                    }
                    label={"Section Questions"}
                    classes={classes}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Divider light={true} style={{ marginTop: "1%" }} />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CollapsePanel
                    component={
                      <SectionQuestionHeadings
                        data={questionHeadings}
                        section={section}
                        showDialog={this.state.heading.dialog}
                        selected={this.state.heading.selected}
                        toggle={this.action.toggleDialog}
                        update={this.api.updateQuestionHeading}
                        insert={this.api.insertNewQuestionHeading}
                        deleteRecord={this.api.deleteQuestionHeading}
                        onChange={this.action.onChangeHeadingLabel}
                        deleteDialog={this.state.delete}
                        deleteRecordForced={
                          this.api.deleteQuestionHeadingForced
                        }
                        confirmDialogToggle={this.action.toggleConfirmDialog}
                      />
                    }
                    label={"Question Headings"}
                    classes={classes}
                    noPaper={true}
                  />
                </GridItem>
                <Snackbar
                  place="br"
                  color="success"
                  icon={SentimentVerySatisfied}
                  message={
                    <span>
                      <b>Yes!</b> Question Heading updated successfully
                    </span>
                  }
                  open={this.state.heading.success}
                />
              </React.Fragment>
            )}
          </GridContainer>
        );
      }
    }
  )
);
