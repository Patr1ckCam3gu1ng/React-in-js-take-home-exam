//npm
import { Component } from "react";
import React from "react";
import { List, Map } from "immutable";
import _ from "lodash";
import PerfectScrollbar from "perfect-scrollbar";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

//my components
import QuestionManageInputs from "components/QuestionManage/inputs";
import api from "apis/index";
import NewHeader from "components/Internals/NewHeader/NewHeader";

//internal
import dashboardRoutes from "routes/dashboard";
import image from "assets/img/sidebar-4.jpg";
import logo from "assets/img/reactlogo.png";
import Footer from "components/Internals/Footer/Footer";
import Sidebar from "components/Internals/Sidebar/Sidebar";

//variables
import { minMaxResponseTypeIds } from "variables/minMax";

//variables
import { fields as inputFields } from "variables/general";

//common
import commonAction from "common/index";

const markedReadOnly = {
  versionNumber: true,
  sectionName: true,
  questionOrder: true,
};

const forceHide = {
  questionLabel: true,
  hideLabel: true,
  questionHeading: true,
};

const forceInclude = {
  responseType: true,
  requiredStatus: true,
  min: true,
  max: true,
  legacyPdfSettings: true,
  // legacyPdfidChars: true
};

class QuestionManage extends Component {
  state = {
    data: {},
    title: "",
    showProgress: false,
  };

  actions = {
    getParentQuestionId: () => {
      const url = window.location.href.split("/");

      let parentQuestionId = -1;

      if (url[url.length - 1] === "new") {
        parentQuestionId = url[url.length - 2];
      }

      return parentQuestionId;
    },
    assignValues: (data) => {
      const values = [];

      let isQuestionCell = false;

      const fields = _.cloneDeep(inputFields);

      fields.map((perRow) => {
        perRow.map((perInput) => {
          function objectify(id, value) {
            return {
              id: id,
              value: value,
            };
          }

          const inputId = perInput.id;

          let coreData = data.data;
          const dropDown = data.dropdowns;

          if (_.isPlainObject(coreData) === false) {
            coreData = _.first(coreData);
          }

          //If the question is created by the Question Cell
          if (coreData.isCellQuestion === true) {
            isQuestionCell = true;

            if (coreData[inputId] === null || forceHide[inputId] === true) {
              const forceIncluded = forceInclude[inputId];

              //Force include an input even if it is entire null.
              if (typeof forceIncluded === "undefined") {
                perInput.hideThis = true;
              }
            }

            if (markedReadOnly[inputId] === true) {
              perInput.readOnlyThis = true;
            }
          }

          if (perInput.type === "select") {
            perInput.selects = List(
              _.cloneDeep(_.filter(dropDown, { matchFor: inputId }))
            );

            const id = inputId + "Id";

            let newValue = coreData[id];

            //IF New SubQuestion, then default to its 'parentQuestionId'
            if (id === "parentQuestionId") {
              const parentQuestionId = this.actions.getParentQuestionId();

              if (parentQuestionId > -1) {
                newValue = parseInt(parentQuestionId, 10);
              }
            }

            values.push(objectify(id, newValue));
          } else {
            const newValue = coreData[inputId];

            values.push(objectify(inputId, newValue));

            this.actions.shouldMinMaxBeDisabled(
              perInput,
              coreData["responseTypeId"]
            );
          }

          return perInput;
        });
        return perRow;
      });

      //Shall be use by 'Hide Label' input.
      values.push(
        {
          id: "parentResponseTypeId",
          value: data.data["parentResponseTypeId"],
        },
        {
          id: "maxClient",
          value: data.data["maxClients"],
        },
        {
          id: "maxAdults",
          value: data.data["maxAdults"],
        }
      );

      return {
        fields,
        values,
        isQuestionCell,
      };
    },
    shouldMinMaxBeDisabled: (perInput, responseType) => {
      if (perInput.id === "min" || perInput.id === "max") {
        //These should be disabled if Response Type is:

        const isEmpty = _.isEmpty(
          _.filter(minMaxResponseTypeIds, {
            id: responseType === -1 ? 0 : responseType,
          })
        );

        perInput.disabled = !isEmpty;
      }
    },
    getQuestionId: () => {
      const url = window.location.href.split("/");

      const urlValue = url[url.length - 1];

      const questionId = urlValue;

      if (
        questionId.indexOf("formversion") > -1 &&
        questionId.indexOf("section") > -1
      ) {
        return "new";
      }

      if (urlValue.indexOf("&newTab") > -1) {
        return urlValue.split("?")[0];
      }

      return questionId;
    },
    getSectionId: () => {
      return commonAction.getSectionId();
    },
    getAuthHeader: () => {
      return `Bearer ${localStorage.getItem("jwtToken")}`;
    },
    isHtmlContent: (values) => {
      const responseTypeId = _.first(
        _.filter(values, {
          id: "responseTypeId",
        })
      ).value;

      const htmlContent = _.first(
        _.filter(values, {
          id: "htmlContent",
        })
      ).value;

      if (responseTypeId === 0 || responseTypeId === null) {
        if (htmlContent !== null) {
          if (htmlContent.trim() !== "") {
            return true;
          }
        }
      }

      return false;
    },
    getTitle: ({ values, isQuestionCell }) => {
      const title = _.first(
        _.filter(values, {
          id: "questionLabel",
        })
      ).value;

      if (title === null) {
        if (this.actions.isHtmlContent(values))
          return (
            <span>
              <b>HTML Content</b>
            </span>
          );
      }

      if (isQuestionCell === true) {
        return (
          <span>
            <b>Edit Question Table cell: </b> {title}
          </span>
        );
      }

      return title;
    },
    assignState: (newData, dropDowns, prevNextQuestionIds, mainFilter) => {
      const fields = List(_.cloneDeep(newData.fields));

      const values = List(_.cloneDeep(newData.values));

      const originalValues = List(_.cloneDeep(newData.values));

      const dropdowns = _.cloneDeep(dropDowns);

      const mainfilter = Map(_.cloneDeep(mainFilter));

      const title = this.actions.getTitle(newData);

      this.setState({
        data: {
          fields: fields,
          values: values,
          originalValues: originalValues,
          dropDowns: dropdowns,
          mainFilter: mainfilter,
          isQuestionCell: newData.isQuestionCell,
          prevNextQuestionIds: prevNextQuestionIds,
        },
        title: title,
      });

      const _that = this;

      _.delay(function () {
        _that.setState({
          showProgress: false,
        });
      }, 300);
    },
    getFilterValues: (filterValues) => {
      return {
        providers: filterValues["providerId"],
        forms: filterValues["formNameId"],
        formversion: filterValues["versionNumberId"],
        section: filterValues["sectionNameId"],
        questionId: filterValues["questionId"],
      };
    },
    setDataState: (data) => {
      const mainFilter = this.actions.getFilterValues(data.data);

      const newData = this.actions.assignValues(data);

      this.actions.assignState(
        newData,
        data.dropdowns,
        data.prevNextQuestionIds,
        mainFilter
      );
    },
    handleOnNewSubQuestion: () => {
      const urlState = Map(this.state.data.mainFilter).toJS();

      this.dbCall.getInsertNewData(urlState);
    },
    saveQuestionIdFromUrl: () => {
      this.setState((state) => {
        return {
          ...state,
          urlQuestionId: this.actions.getQuestionId(),
        };
      });
    },
    HandleOnGridSubQuestionClick: () => {
      const urlState = this.props.location.state;

      if (typeof urlState === "undefined") {
        return;
      }

      //Triggered if you click the subQuestion via the Parent
      if (urlState.referer === "parent" || urlState.referer === "subQuestion") {
        //If new QuestionId in the URL has been detected,
        //then fetch the corresponding data and repopulate everything.

        // if (typeof this.state.urlQuestionId !== "undefined") {
        if (
          _.isEqual(this.state.urlQuestionId, this.actions.getQuestionId()) ===
          false
        ) {
          this.actions.repopulateEverything();
        }
        // }
      }
    },
    repopulateEverything: () => {
      this.setState((state) => {
        return {
          ...state,
          showProgress: true,
        };
      });

      this.dbCall.getExistingData();
    },
    detectIfGoBack: () => {
      const urlQuestionId = this.state.urlQuestionId;

      const currentQuestionId = this.actions.getQuestionId();

      if (urlQuestionId !== currentQuestionId) {
        this.actions.repopulateEverything();
      }
    },
    getParams: () => {
      const section = new URL(window.location.href).searchParams.get("section");

      const formversion = new URL(window.location.href).searchParams.get(
        "formversion"
      );

      return {
        forms: -1,
        providers: -1,
        questionId: -1,
        section,
        formversion,
      };
    },
    handleOnScrollTop: () => {
      this.mainPanel.scrollTop = 0;
    },
    closeSideMenu: (e) => {
      if (e === "header") {
        this.setState({ open_side_menu: true });
      } else {
        this.setState({ open_side_menu: false });
      }
    },
  };

  dbCall = {
    getDataNewQuestion: (urlState) => {
      api
        .get()
        .getDataNewQuestion(this.actions.getAuthHeader(), urlState)
        .then((data) => {
          this.actions.setDataState(data);
        });
    },
    getData: () => {
      api
        .get()
        .questionDetails(
          this.actions.getAuthHeader(),
          this.actions.getQuestionId(),
          this.actions.getSectionId()
        )
        .then((data) => {
          this.actions.setDataState(data);
        });
    },
    getExistingData: () => {
      this.dbCall.getData();

      this.actions.saveQuestionIdFromUrl();
    },
    getInsertNewData: (urlState) => {
      this.dbCall.getDataNewQuestion(urlState);
    },
  };

  componentDidMount() {
    const urlState = this.props.location.state;

    if (typeof urlState === "undefined") {
      //if opened from a new tab.
      if (this.actions.getParams()["formversion"] === null) {
        this.dbCall.getExistingData();
      } else {
        this.dbCall.getDataNewQuestion(this.actions.getParams());
      }
    } else {
      //INFO: This gets triggered when the user force refresh the page.
      if (
        urlState.referer === "parent" ||
        urlState.referer === "subQuestion" ||
        urlState.referer === "questionMasterTable" ||
        urlState.referer === "sectionQuestionTable"
      ) {
        this.dbCall.getExistingData();
      } else {
        this.dbCall.getInsertNewData(urlState);
      }
    }

    if (navigator.platform.indexOf("Win") > -1) {
      new PerfectScrollbar(this.mainPanel);
    }
  }

  componentDidUpdate() {
    this.actions.HandleOnGridSubQuestionClick();

    this.mainPanel.scrollTop = 0;

    this.actions.detectIfGoBack();
  }

  render() {
    const { classes, history, ...rest } = this.props;

    return (
      <div className={classes.wrapper}>
        <NewHeader onClick={(e) => this.actions.closeSideMenu(e)} />
        <Sidebar
          routes={dashboardRoutes}
          logoText={"BlackFinTech"}
          logo={logo}
          image={image}
          onClick={(e) => this.actions.closeSideMenu(e)}
          open={this.state.open_side_menu}
          color="blue"
          {...rest}
        />
        <div
          className={this.state.open_side_menu ? classes.mainPanel : ""}
          ref={(el) => (this.mainPanel = el)}
        >
          <div className={classes.content}>
            <div className={classes.container}>
              {typeof this.state.data.values === "undefined" ? (
                <LinearProgress
                  style={{
                    marginTop: "30%",
                  }}
                  classes={{
                    colorPrimary: classes.colorPrimary,
                    barColorPrimary: classes.barColorPrimary,
                  }}
                />
              ) : (
                <QuestionManageInputs
                  dataValues={this.state.data}
                  title={this.state.title}
                  filterValues={this.state.data.mainFilter}
                  showProgress={this.state.showProgress}
                  onNewSubQuestion={this.actions.handleOnNewSubQuestion}
                  history={history}
                  onInsertSuccess={this.dbCall.getExistingData}
                  locationState={this.props.location.state}
                />
              )}
            </div>
          </div>
          {<Footer />}
        </div>
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(QuestionManage);
