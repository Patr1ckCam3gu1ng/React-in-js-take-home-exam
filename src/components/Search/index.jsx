//npm
import React from "react";
import { withRouter } from "react-router";
import _ from "lodash";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Stepper from "@material-ui/core/Stepper";
import Button from "@material-ui/core/Button/Button";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Divider from "@material-ui/core/Divider/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import red from "@material-ui/core/colors/red";

//Internals
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";

//api
import api from "apis/index";

export default withRouter(
  withStyles(theme => ({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: "100%",
      fontWeight: "bold"
    },
    root: {
      width: "90%"
    },
    backButton: {
      marginRight: theme.spacing.unit
    },
    instructions: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    },
    avatar: {
      backgroundColor: red[500]
    }
  }))(
    class Steps extends React.Component {
      state = {
        activeStep: 0,
        inputConvertedUrls: "inputConvertedUrls"
      };

      stepContents = {
        inputQuestionIds: () => {
          const { classes } = this.props;

          return (
            <TextField
              className={classes.textField}
              id={"inputQuestionIds"}
              label={"QuestionIds"}
              placeholder={"Enter the QuestionId to generate"}
              name={"inputQuestionIds"}
              onChange={event => this.actions.onTextChange(event)}
              value={this.state.questionIds}
              // required={required}
              multiline={true}
              rows={5}
              rowsMax={7}
              fullWidth={true}
              margin="normal"
              type={"number"}
              // inputProps={inputProps}
              // error={checkRequired ? isError : false}
              // helperText={checkRequired ? (isError ? "Required" : null) : false}
            />
          );
        },
        inputResults: () => {
          const { classes } = this.props;

          const { data, inputConvertedUrls } = this.state;

          const url = window.location.protocol + "//" + window.location.host;

          let completeUrls = "";

          data.forEach(function(perItem) {
            completeUrls += `${url}/sections/${perItem.sectionId}/questions/${
              perItem.questionId
            }\n`;
          });

          return (
            <TextField
              className={classes.textField}
              id={inputConvertedUrls}
              label={"Generated URL"}
              name={inputConvertedUrls}
              value={completeUrls}
              // required={required}
              multiline={true}
              rows={5}
              rowsMax={7}
              fullWidth={true}
              margin="normal"
            />
          );
        },
        inputCopied: () => {
          const { classes } = this.props;

          const subHeader = `${this.state.data.length} records in total`;

          return (
            <React.Fragment>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    C
                  </Avatar>
                }
                style={{
                  marginLeft: "25%"
                }}
                title="Copied to Clipboard"
                subheader={subHeader}
              />
              <Divider light={true} />
              <br />
            </React.Fragment>
          );
        }
      };

      actions = {
        onTextChange: event => {
          const value = event.target.value;

          this.setState(state => ({
            ...state,
            questionIds: value
          }));
        },
        getStepContent: stepIndex => {
          switch (stepIndex) {
            case 0:
              return this.stepContents.inputQuestionIds();
            case 1:
              return this.stepContents.inputResults();
            case 2:
              return this.stepContents.inputCopied();
            default:
              return "Unknown stepIndex";
          }
        },
        handleReset: () => {
          this.setState({
            activeStep: 0
          });
        },
        handleBack: () => {
          this.setState(state => ({
            activeStep: state.activeStep - 1
          }));
        },
        handleNext: () => {
          const { activeStep, questionIds } = this.state;

          if (activeStep === 0 && typeof questionIds !== "undefined") {
            const ids = questionIds.split(/\r?\n/);

            const filteredIds = [];

            ids.forEach(function(perId) {
              if (perId !== "") {
                filteredIds.push(_.cloneDeep(perId));
              }
            });

            this.api.getDetails({
              questionIds: filteredIds
            });

            return;
          }
          if (activeStep === 1) {
            const copyText = document.getElementById(
              this.state.inputConvertedUrls
            );

            copyText.select();

            document.execCommand("copy");

            this.actions.moveNext();
          }
        },
        getSteps: () => {
          return [
            "Input QuestionIds to generate",
            "Generated URL per QuestionId",
            "Copied to Clipboard"
          ];
        },
        moveNext: () => {
          this.setState(state => ({
            activeStep: state.activeStep + 1
          }));
        }
      };

      api = {
        getDetails: questionIds => {
          const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

          api
            .getWithBody()
            .sectionIdByQuestionId(jwt, questionIds)
            .then(response => {
              this.setState(() => ({
                data: response.data
              }));

              this.actions.moveNext();
            });
        }
      };

      componentDidMount() {}

      render() {
        const { classes } = this.props;
        const steps = this.actions.getSteps();
        const { activeStep } = this.state;

        return (
          <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Divider light={true} />
            <GridContainer>
              <GridItem md={3} />
              {this.state.activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed
                  </Typography>
                  <Button onClick={this.actions.handleReset}>Reset</Button>
                </div>
              ) : (
                <GridItem md={6}>
                  {this.actions.getStepContent(activeStep)}
                  <GridContainer>
                    <GridItem md={7} />
                    <GridItem md={5}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.actions.handleBack}
                        className={classes.backButton}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.actions.handleNext}
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              )}
              <GridItem md={3} />
            </GridContainer>
          </div>
        );
      }
    }
  )
);
