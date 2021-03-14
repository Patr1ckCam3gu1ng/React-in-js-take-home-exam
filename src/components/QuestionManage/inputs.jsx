//npm
import React, { Component } from "react";
import _ from "lodash";
import { List } from "immutable";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Select from "react-select";

//internals
import GridItem from "components/Internals/Grid/GridItem.jsx";
import GridContainer from "components/Internals/Grid/GridContainer.jsx";
import Card from "components/Internals/Card/Card.jsx";
import CardHeader from "components/Internals/Card/CardHeader.jsx";
import CardBody from "components/Internals/Card/CardBody.jsx";
import Snackbar from "components/Internals/Snackbar/Snackbar";
import CardFooter from "components/Internals/Card/CardFooter";

//my compoennts
import api from "apis/index";
import QuestionManageGrids from "components/QuestionManage/grid";
import QuestionDialogNew from "components/QuestionManage/questionDialogNew";
import QuestionDialogDelete from "components/QuestionManage/questionDialogDelete";
import QuestionDialogIncrement from "components/QuestionManage/questionDialogIncrement";
import QuestionNextPrevDialog from "components/QuestionManage/questionNextPrevDialog";
import LegacyPdfDialog from "components/LegacyPdf";

import {
  SelectInput,
  TextInput,
  getValue,
} from "components/QuestionManage/inputsControls";

//variables
import { fields } from "variables/general";

//material
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import NoSsr from "@material-ui/core/NoSsr";

//icons
import Beenhere from "@material-ui/icons/Beenhere";
import Cancel from "@material-ui/icons/Cancel";
import AttachFile from "@material-ui/icons/AttachFile";
import Save from "@material-ui/icons/Save";
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline";
import CheckBox from "@material-ui/icons/CheckBox";
import Warning from "@material-ui/icons/Warning";
import classNames from "classnames";
import Next from "@material-ui/icons/ArrowForwardIos";
import Previous from "@material-ui/icons/ArrowBackIos";

//variables
import { minMaxResponseTypeIds } from "variables/minMax";

//common
import commonAction from "common/index";
import hubs from "hubs/index";

//autocomplete component
import autoComplete from "components/Autocomplete/index";

//autocomplete styles
import autocompleteStyles from "assets/jss/autocomplete/index";

function ShowProgressBar({ classes, showProgress }) {
  if (showProgress) {
    return (
      <LinearProgress
        style={{
          marginLeft: "1%",
        }}
        classes={{
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
      />
    );
  }

  return <span />;
}

class QuestionManageInputs extends Component {
  state = {
    data: [],
    checkRequired: false,
    deletion: {},
    legacyPdfSetting: {},
    showLegacyPdfError: false,
    keyLegacyPdfDialog: 1,
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
    getAuthHeader: () => {
      return `Bearer ${localStorage.getItem("jwtToken")}`;
    },
    isNewTab: () => {
      const url = window.location.href.split("/");

      const questionId = url[url.length - 1];

      return questionId.indexOf("&newTab") > -1;
    },
    getQuestionId: () => {
      return commonAction.getQuestionId();
    },
    getSectionId: () => {
      return commonAction.getSectionId();
    },
    getUpdatedInputs: () => {
      return List(this.state.data.values).toJS();
    },
    getReturnUrl: () => {
      const { filterValues } = this.state;

      let url = "";

      filterValues.map((prop, key) => {
        if (key === "questionId") {
          return prop;
        }

        url += `&${key}=${prop}`;

        return prop;
      });

      return `${process.env.PUBLIC_URL}/questions?${url}`;
    },
    getCancelLinkTo: (locationState) => {
      const sectionId = this.actions.getSectionId();

      if (typeof locationState !== "undefined") {
        if (locationState.referer === "parent") {
          return `${process.env.PUBLIC_URL}/sections/${sectionId}/questions/${locationState.parentQuestionId}`;
        }
      }

      return this.actions.getReturnUrl();
    },
    getCancelLinkState: (locationState) => {
      if (typeof locationState !== "undefined") {
        if (locationState.referer === "parent") {
          return {
            referer: "subQuestion",
          };
        }
      }
      return;
    },
    getUrlLikParams: (locationState) => {
      if (this.actions.isNewTab() === true) {
        return "?&newTab=";
      }

      const linkTo = this.actions.getCancelLinkTo(locationState);
      const linkState = this.actions.getCancelLinkState(locationState);

      if (typeof linkState !== "undefined") {
        return {
          pathname: linkTo,
          state: linkState,
        };
      }

      if (typeof locationState !== "undefined") {
        if (locationState.referer === "questionMasterTable") {
          const { page } = locationState;

          if (page === null) {
            return linkTo;
          } else {
            if (page > 0) {
              return `${linkTo}&page=${page}`;
            }
          }
        }
        if (locationState.referer === "sectionQuestionTable") {
          //INFO: This is referred from Sections > Section Question
          return locationState.returnUrl;
        }
      }

      return linkTo;
    },
    updateStateIfNotEqual: () => {
      const { data } = this.state;

      const { dataValues } = this.props;

      const oldState = List(data.values).toJS();
      const newState = List(dataValues.values).toJS();

      if (_.isEqual(oldState, newState) === false) {
        this.setState((state) => {
          return {
            ...state,
            data: dataValues,
          };
        });

        return true;
      }

      return false;
    },
    handleOnTextChange: (event) => {
      const { value, name } = event.target;

      const perValue = _.filter([...this.state.data.values], {
        id: name,
      });

      perValue[0].value = value;

      this.forceUpdate();
    },
    shouldBecomeRequired_RequiredStatus: (value) => {
      const valueIfRequired = 2;

      const name = "parentQuestion";

      this.state.data.fields.map((prop) => {
        let requireParentOption = false;

        _.filter(prop, { id: name }).map((subProp) => {
          subProp.required = value === valueIfRequired;

          const parentQuestion = _.first(
            _.filter(List(this.state.data.values).toJS(), { id: name + "Id" })
          );

          if (typeof parentQuestion.value === "number" && subProp.required) {
            requireParentOption = true;
          }

          return subProp;
        });

        _.filter(prop, { id: "optionLabel" }).map((subProp) => {
          subProp.required = requireParentOption;
          return subProp;
        });

        return prop;
      });

      this.forceUpdate();
    },
    makeQuestionLabelNotRequired: (value) => {
      this.state.data.fields.map((prop) => {
        _.filter(prop, { id: "questionLabel" }).map((subProp) => {
          subProp.required = !value;

          return subProp;
        });

        return prop;
      });
    },
    ifEnableMinMax: (dataValues) => {
      const _that = this;

      setTimeout(function () {
        _that.actions.shouldBecomeEnabled_MinMax(
          _.first(_.filter(dataValues.values.toJS(), { id: "responseTypeId" }))
            .value
        );

        _that.forceUpdate();
      }, 100);
    },
    ifEnableDateAccuracy: (dataValues) => {
      const _that = this;

      setTimeout(function () {
        _that.actions.shouldBecomeEnabled_DateAccuracy(
          _.first(_.filter(dataValues.values.toJS(), { id: "responseTypeId" }))
            .value
        );

        _that.forceUpdate();
      }, 100);
    },
    shouldBecomeEnabled_DateAccuracy: (value) => {
      if (value === 2 /*date*/) {
        this.state.data.fields.map((prop) => {
          _.filter(prop, function (obj) {
            return obj.id === "dateAccuracy";
          }).map((subProp) => {
            subProp.disabled = false;
            subProp.readOnlyThis = false;
            return subProp;
          });
          return prop;
        });
      }
    },
    shouldBecomeEnabled_MinMax: (value) => {
      const isEmpty = _.isEmpty(
        _.filter(minMaxResponseTypeIds, { id: value === -1 ? 0 : value })
      );

      if (typeof this.state.data.fields === "undefined") {
        return;
      }

      this.state.data.values.map((prop) => {
        if (isEmpty === false) {
          if (prop.id === "min") {
            prop.value = null;
          }
          if (prop.id === "max") {
            prop.value = null;
          }
        }
        return prop;
      });

      this.state.data.fields.map((prop) => {
        _.filter(prop, function (obj) {
          return obj.id === "min" || obj.id === "max";
        }).map((subProp) => {
          subProp.disabled = !isEmpty;

          return subProp;
        });

        return prop;
      });
    },
    shouldBecomeRequired_DateAccuracy: (value) => {
      this.state.data.fields.map((prop) => {
        _.filter(prop, { id: "dateAccuracy" }).map((subProp) => {
          // subProp.required = value === 2 /*date*/;
          subProp.readOnlyThis = value !== 2;

          const perValue = _.first(
            _.filter([...this.state.data.values], { id: "dateAccuracyId" })
          );

          perValue.value = subProp.required ? perValue.value : null;

          return subProp;
        });
        return prop;
      });
    },
    shouldBecomeRequired_ResponseType: (value) => {
      //if (`Response Type` != none || table), then 'Required Type' is mandatory
      this.state.data.fields.map((prop) => {
        _.filter(prop, { id: "requiredStatus" }).map((subProp) => {
          subProp.required = !(
            (
              value === -1 /*None*/ ||
              value === 6 /*Table*/ ||
              value === 14
            ) /*scrollable*/
          );

          this.actions.makeQuestionLabelNotRequired(
            value === -1 /*none*/ || value === 14 /*scrollable*/
          );

          return subProp;
        });

        return prop;
      });
    },
    setParentOptionToNull: () => {
      // On-change of ParentQuestion:
      // if set to null
      // set ParentOption = null

      const perValue = _.filter([...this.state.data.values], {
        id: "optionLabelId",
      });

      perValue[0].value = null;
    },
    shouldBecomeRequired_OptionLabel: (isRequired) => {
      this.state.data.fields.map((prop) => {
        _.filter(prop, { id: "optionLabel" }).map((subProp) => {
          subProp.required = isRequired;
          return subProp;
        });

        return prop;
      });

      this.forceUpdate();
    },
    isAllowLegacyPdfAmendments: (value) => {
      if (
        value === -1 /*none*/ ||
        value === 0 /*none*/ ||
        value === 6 /*table*/ ||
        value === 12 /*group*/ ||
        value === 14 /*scrollable*/
      ) {
        const { dropDowns, values } = this.state.data;

        const legacyPdfSettingValue = _.first(
          _.filter(_.cloneDeep(values.toJS()), {
            id: "legacyPdfSettings",
          })
        ).value;

        //'null' if it a new question
        if (
          legacyPdfSettingValue === "Click to edit" ||
          legacyPdfSettingValue === null
        ) {
          return true;
        }

        let timer;

        const _that = this;

        (() => {
          window.clearTimeout(timer);

          const responseTypeName = _.first(
            _.filter(_.cloneDeep(dropDowns), {
              matchFor: "responseType",
              id: value === -1 ? 0 : value,
            })
          ).name;

          _that.setState((state) => {
            return {
              ...state,
              showLegacyPdfError: true,
              showLegacyPdfErrorMessage: `You cannot modify this question to '${responseTypeName}' 
                because it has existing Legacy PDF Settings`,
            };
          });

          timer = window.setTimeout(function () {
            _that.setState((state) => {
              return {
                ...state,
                showLegacyPdfError: false,
              };
            });
          }, 3000);
        })();

        return false;
      }

      return true;
    },
    handleOnSelectChange: (event) => {
      const { value, name } = event.target;

      const perValue = _.filter([...this.state.data.values], {
        id: name + "Id",
      });

      perValue[0].value = value;

      if (name === "parentQuestion") {
        if (value === -1) {
          const requiredStatusValue = _.first(
            _.filter(List(this.state.data.values).toJS(), {
              id: "requiredStatusId",
            })
          ).value;

          if (requiredStatusValue === 2 /*conditional*/) {
            this.state.data.fields.map((prop) => {
              _.filter(prop, { id: "parentQuestion" }).map((subProp) => {
                subProp.required = true;

                return subProp;
              });

              return prop;
            });

            this.forceUpdate();

            return;
          }

          this.actions.shouldBecomeRequired_OptionLabel(false);

          this.actions.setParentOptionToNull();
        } else {
          this.dbCall.GetOptions(value);

          this.actions.shouldBecomeRequired_OptionLabel(true);
        }
      } else if (name === "sectionName") {
        this.dbCall.GetParentQuestionBySectionId(value);
      } else if (name === "requiredStatus") {
        this.actions.shouldBecomeRequired_RequiredStatus(value);
      } else if (name === "responseType") {
        const isAllowed = this.actions.isAllowLegacyPdfAmendments(value);

        if (isAllowed === false) {
          return;
        }

        this.actions.shouldBecomeEnabled_MinMax(value);
        this.actions.shouldBecomeRequired_ResponseType(value);
        this.actions.shouldBecomeRequired_DateAccuracy(value);

        const _that = this;
        _.delay(function () {
          _that.forceUpdate();
        }, 200);
      } else {
        this.forceUpdate();
      }
    },
    registerHub: () => {
      const dataValues = this.props.dataValues;

      const responseType = _.first(
        _.filter(dataValues.values.toJS(), { id: "responseTypeId" })
      );

      if (responseType === 6 /*table*/ || dataValues.isQuestionCell === true) {
        const { start, connection } = hubs.connect("questionTable");

        const func = () => {
          this.setState((state) => {
            return {
              ...state,
              hubQuestionTable: connection,
            };
          });
        };

        start().then(func);
      }
    },
    refreshParentQuestionTable: () => {
      const { hubQuestionTable } = this.state;

      //INFO: This means it is now a 'responseType=6' or 'table'
      if (typeof hubQuestionTable === "undefined") {
        return;
      }

      hubQuestionTable.invoke(
        "RefreshQuestionTable",
        this.actions.getQuestionId()
      );
    },
    handleUpdateExisting: () => {
      const data = this.actions.getUpdatedInputs();

      const state = this.actions.getPastAndPresentStates(data);

      const hasEmptyRequired = this.actions.requiredFieldsChecker(state, data);

      const isAllowLegacyPdf = this.actions.isAllowLegacyPdfAmendments(
        state.presentState.responseTypeId
      );

      if (hasEmptyRequired || isAllowLegacyPdf === false) {
        return;
      }

      if (_.isEqual(state.presentState, state.pastState)) {
      } else {
        this.dbCall.UpdateExisting(state.presentState);
      }
    },
    handleConfirmYes: () => {
      this.dbCall.InsertNew(this.state.IfYesUseThisData);
    },
    handleConfirmCancel: () => {
      this.setState((state) => {
        return {
          ...state,
          showInsertConfirm: false,
        };
      });
    },
    requiredFieldsChecker: (state, values) => {
      let requiredFields = [];

      const stateFields = this.state.data.fields;

      stateFields.map((prop) => {
        prop.map((subProp) => {
          //force include those are not required but are conditional required.
          const isConditionalRequired = subProp.id === "requiredStatus";

          if (subProp.required || isConditionalRequired) {
            requiredFields.push({
              id: subProp.id,
              isSelect: subProp.type === "select",
            });
          }

          return subProp;
        });

        return prop;
      });

      // ------------------------------------------------

      let hasEmptyRequired = false;

      requiredFields.map((prop) => {
        const value = state.presentState[prop.id + (prop.isSelect ? "Id" : "")];

        if (typeof value === "undefined" || value === null || value === "") {
          hasEmptyRequired = true;
        }

        //conditional required
        if (
          prop.id === "parentQuestion" &&
          (value === 0 || value === null) &&
          state.presentState["requiredStatusId"] === 2
        ) {
          hasEmptyRequired = true;
        }
        return prop;
      });

      //Ignore 'Required' If it is HTML Content
      if (hasEmptyRequired) {
        hasEmptyRequired = !this.actions.isHtmlContent(values);
      }

      // ------------------------------------------------

      this.setState((state) => {
        return {
          ...state,
          checkRequired: hasEmptyRequired,
        };
      });

      return hasEmptyRequired;
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

      if (responseTypeId === 0 /*none*/) {
        if (htmlContent !== null) {
          if (htmlContent.trim() !== "") {
            return true;
          }
        }
      }
    },
    handleOnNextQuestion: (position) => {
      const data = this.actions.getUpdatedInputs();

      const state = this.actions.getPastAndPresentStates(data);

      const hasEmptyRequired = this.actions.requiredFieldsChecker(state, data);

      if (hasEmptyRequired) {
        return;
      }

      if (_.isEqual(state.presentState, state.pastState)) {
        const { previous, next } = this.actions.handleGetNextQuestion();

        this.actions.handleNextPrevOnClick.goToQuestionId(
          position === "next" ? next : previous
        );
      } else {
        this.setState((state) => {
          return {
            ...state,
            showConfirmNextPrevMessage: true,
            showConfirmNextPrevPosition: position,
          };
        });
      }
    },
    handleGetNextQuestion: () => {
      const { dataValues } = this.props;

      const { prevNextQuestionIds } = dataValues;

      let previous = 0;

      let next = 0;

      if (typeof prevNextQuestionIds !== "undefined") {
        if (prevNextQuestionIds !== null) {
          previous = prevNextQuestionIds.previous;
          next = prevNextQuestionIds.next;
        }
      }

      return {
        previous,
        next,
      };
    },
    handleInsertNew: () => {
      const data = this.actions.getUpdatedInputs();

      const allState = this.actions.getPastAndPresentStates(data);

      const hasEmptyRequired = this.actions.requiredFieldsChecker(
        allState,
        data
      );

      // ------------------------------------------------

      if (hasEmptyRequired === false) {
        this.setState((state) => {
          return {
            ...state,
            showInsertConfirm: true,
            IfYesUseThisData: allState.presentState,
          };
        });
      }
    },
    getPastAndPresentStates: (data) => {
      const presentState = {};

      data.map((prop) => {
        presentState[prop.id] = prop.value === -1 ? 0 : prop.value;

        return prop;
      });

      const pastState = {};

      const originalValues = [...this.state.data.originalValues];

      originalValues.map((prop) => {
        pastState[prop.id] = prop.value === -1 ? 0 : prop.value;

        return prop;
      });

      return {
        presentState,
        pastState,
      };
    },
    assignValues: (data) => {
      const values = [];

      fields.map((perRow) => {
        perRow.map((perInput) => {
          function objectify(id, value) {
            return {
              id: id,
              value: value,
            };
          }

          let coreData = data.data;
          const dropDown = data.dropdowns;

          if (_.isPlainObject(coreData) === false) {
            coreData = _.first(coreData);
          }

          if (perInput.type === "select") {
            perInput.selects = List(
              _.cloneDeep(_.filter(dropDown, { matchFor: perInput.id }))
            );

            const id = perInput.id + "Id";

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
            const newValue = coreData[perInput.id];

            values.push(objectify(perInput.id, newValue));
          }

          return perInput;
        });

        return perRow;
      });

      return {
        fields,
        values,
      };
    },
    handleSuccessUpdates: () => {
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
        }, 500);
      };

      this.showThenHideAlert();
    },
    handleShowUpdateError: (errorDescription) => {
      this.setState((state) => {
        return {
          ...state,
          UpdateErrorMessage: errorDescription,
          showUpdateError: true,
        };
      });

      let timer;

      ((_that) => {
        window.clearTimeout(timer);

        timer = window.setTimeout(function () {
          _that.setState((state) => {
            return {
              ...state,
              UpdateErrorMessage: "",
              showUpdateError: false,
            };
          });
        }, 6000);
      })(this);
    },
    handleFailedUpdates: () => {
      this.setState((state) => {
        return {
          ...state,
          showErrorAlert: true,
        };
      });

      let timer;

      const _that = this;

      this.showThenHideErrorAlert = () => {
        window.clearTimeout(timer);

        timer = window.setTimeout(function () {
          _that.setState((state) => {
            return {
              ...state,
              showErrorAlert: false,
            };
          });
        }, 2000);
      };

      this.showThenHideErrorAlert();
    },
    getSelectedResponseType: () => {
      let value = -1;

      if (typeof this.state.data.originalValues === "undefined") {
        return value;
      }

      this.state.data.originalValues.map((prop) => {
        if (prop.id === "responseTypeId") {
          value = prop.value;
        }
        return prop;
      });

      return value;
    },
    showNewTemplateAlert: () => {
      const _that = this;

      _.delay(function () {
        _that.setState((state) => {
          return {
            ...state,
            showNewTemplateAlert: true,
          };
        });

        let timer;

        function showThenHideErrorAlert() {
          window.clearTimeout(timer);

          timer = window.setTimeout(function () {
            _that.setState((state) => {
              return {
                ...state,
                showNewTemplateAlert: false,
              };
            });
          }, 2000);
        }

        showThenHideErrorAlert();
      }, 500);
    },
    showSuccessInsert: () => {
      this.props.onInsertSuccess();

      const _that = this;

      _.delay(function () {
        _that.setState((state) => {
          return {
            ...state,
            showSuccessInsert: true,
          };
        });

        let timer;

        function showThenHideErrorAlert() {
          window.clearTimeout(timer);

          timer = window.setTimeout(function () {
            _that.setState((state) => {
              return {
                ...state,
                showSuccessInsert: false,
              };
            });
          }, 1500);
        }

        showThenHideErrorAlert();
      }, 800);
    },
    handleQuestionDelete: () => {
      this.setState((state) => {
        return {
          ...state,
          showDeleteConfirm: true,
        };
      });
    },
    handleQuestionDeleteCancel: () => {
      this.setState((state) => {
        return {
          ...state,
          showDeleteConfirm: false,
        };
      });
    },
    handleQuestionDeleteYes: () => {
      const { data } = this.state;

      const questionId = data.mainFilter.get("questionId");

      const sectionId = data.mainFilter.get("section");

      this.dbCall.deleteQuestion(sectionId, questionId);
    },
    invokeRefreshQuestionList: () => {
      const { start, connection } = hubs.connect("deleteQuestion");

      start().then(() => {
        connection.invoke("RefreshQuestionListOnDelete");
      });
    },
    handleQuestionDeleteResponse: (data) => {
      const responseCode = _.first(data).questionCode;

      const description = _.first(data).questionDescription;

      const _that = this;

      if (responseCode !== 5) {
        failed();
      } else {
        success();
      }

      function success() {
        _that.actions.invokeRefreshQuestionList();

        _that.setState((state) => {
          return {
            ...state,
            deletion: {
              message: "Question deleted successfully",
              isOpen: true,
              icon: CheckBox,
              color: "success",
            },
            showDeleteConfirm: false,
          };
        });

        if (_that.actions.isNewTab()) {
          setTimeout(function () {
            window.close();
          }, 1000);
        } else {
          _.delay(function () {
            window.location = _that.actions.getUrlLikParams(
              _that.props.locationState
            );
          }, 800);
        }
      }

      function failed() {
        _that.setState((state) => {
          return {
            ...state,
            deletion: {
              message: (
                <span>
                  <b>Failed </b>
                  {description}
                </span>
              ),
              isOpen: true,
              icon: RemoveCircleOutline,
              color: "danger",
            },
            showDeleteConfirm: false,
          };
        });

        let timer;

        _that.showThenHideAlert = () => {
          window.clearTimeout(timer);

          timer = window.setTimeout(function () {
            _that.setState((state) => {
              return {
                ...state,
                deletion: {
                  ...state.deletion,
                  isOpen: false,
                },
              };
            });
          }, 3000);
        };

        _that.showThenHideAlert();
      }
    },
    handleOnIncrementCancel: () => {
      this.setState((state) => {
        return {
          ...state,
          showConfirmIncrement: false,
          showConfirmIncrementMessage: "",
        };
      });
    },
    handleOnIncrementYes: () => {
      const clonedInputs = _.cloneDeep(this.state.IfYesUseThisData);

      clonedInputs.confirmationNumber = _.cloneDeep(
        this.state.confirmationNumber
      );

      this.dbCall.InsertNew(clonedInputs);
    },
    toggleOptionLabelAndHideLabel: (data) => {
      if (data.responseType === null) {
        return;
      }

      //ParentQuestion's Parent Option should not become mandatory if ResponseType = group.
      const isResponseTypeGroup = data.responseType.id === 12;

      this.state.data.fields.map((prop) => {
        _.filter(prop, { id: "hideLabel" }).map((subProp) => {
          subProp.ParentOptionResponseTypeId = data.responseType.id;

          subProp.disabled = !isResponseTypeGroup;

          return subProp;
        });

        return prop;
      });

      this.actions.shouldBecomeRequired_OptionLabel(!isResponseTypeGroup);
    },
    handleNextPrevOnClick: {
      yes: () => {
        const data = this.actions.getUpdatedInputs();

        const questionId = this.actions.handleNextPrevOnClick.getPrevOrNextQuestionId();

        this.actions.handleNextPrevOnClick.updateQuestion(
          this.actions.getPastAndPresentStates(data).presentState,
          questionId
        );
      },
      no: () => {
        const questionId = this.actions.handleNextPrevOnClick.getPrevOrNextQuestionId();

        this.actions.handleNextPrevOnClick.goToQuestionId(questionId);

        this.actions.handleNextPrevOnClick.hideDialog();
      },
      cancel: () => {
        this.actions.handleNextPrevOnClick.hideDialog();
      },
      getPrevOrNextQuestionId: () => {
        const { previous, next } = this.actions.handleGetNextQuestion();

        let questionId = 0;

        if (this.state.showConfirmNextPrevPosition === "next") {
          questionId = next;
        } else {
          questionId = previous;
        }

        return questionId;
      },
      updateQuestion: (inputs, questionId) => {
        api
          .update()
          .question(
            this.actions.getAuthHeader(),
            inputs,
            this.actions.getQuestionId(),
            this.actions.getSectionId()
          )
          .then((data) => {
            if (data.status === 400) {
              this.actions.handleShowUpdateError(data.data[0].errorDescription);

              return;
            }

            this.actions.handleNextPrevOnClick.hideDialog();

            this.actions.handleNextPrevOnClick.goToQuestionId(questionId);
          })
          .catch(() => {
            this.actions.handleFailedUpdates();
          });
      },
      hideDialog: () => {
        this.setState((state) => {
          return {
            ...state,
            showConfirmNextPrevMessage: false,
          };
        });
      },
      goToQuestionId: (questionId) => {
        const sectionId = this.actions.getSectionId();

        const url = `${process.env.PUBLIC_URL}/sections/${sectionId}/questions/${questionId}`;

        this.props.history.push(url);
      },
    },
    previewHtml: {
      displayTextIfSo: (propColumn, isEmpty) => {
        if (isEmpty) {
          return <span />;
        }

        return propColumn.id === "htmlContent" ? (
          <GridItem md={12}>
            <Link
              style={{ float: "right" }}
              onClick={() =>
                this.actions.previewHtml.onClick(this.actions.getQuestionId())
              }
              to={"#"}
            >
              Preview
            </Link>
          </GridItem>
        ) : (
          <span />
        );
      },
      onClick: (questionId) => {
        this.dbCall.generatePDF(questionId);
      },
    },
    handleOnAutocompleteChange: (event, name) => {
      this.actions.handleOnSelectChange({
        target: {
          value: event == null ? event : event.value,
          name: name,
        },
      });

      return event;
    },
    AutoCompleteInput: ({ prop, classes, values, onChange, autocomplete }) => {
      const selectStyles = {
        input: (base) => ({
          ...base,
          color: "black",
          "& input": {
            font: "inherit",
          },
        }),
      };

      const components = autocomplete.components();

      const suggestions = prop.selects
        .map((suggestion) => ({
          /*INFO: Since the autocomplete ignores '0' value when onChange*/
          value: suggestion.id === 0 ? -1 : suggestion.id,
          label: suggestion.name,
        }))
        .toJS();

      let updatedValue = _.first(
        _.filter(suggestions, { value: getValue(values, prop.id, true) })
      );

      const isRequired =
        typeof prop.required === "undefined" ? false : prop.required === true;

      //INFO: Exclude from checking the 'responseType' since the 'requiredType'
      //      has an empty null value that is also '-1'
      updatedValue =
        typeof updatedValue === "undefined"
          ? null
          : updatedValue.value === -1 && prop.id !== "responseType"
          ? null
          : updatedValue;

      return (
        <GridItem md={prop.colSpan}>
          <NoSsr>
            <div className={classes.autoComplete}>
              <Select
                classes={classes}
                styles={selectStyles}
                options={suggestions}
                components={components}
                onChange={(event) => onChange(event, prop.id)}
                value={updatedValue}
                textFieldProps={{
                  label: prop.labelText + (isRequired === true ? " *" : ""),
                  InputLabelProps: {
                    shrink: true,
                    style: { paddingTop: "5px" },
                  },
                }}
                isClearable
                placeholder={isRequired === true ? "Required *" : ""}
              />
            </div>
          </NoSsr>
        </GridItem>
      );
    },
    handleOnClick: {
      legacyPdfSetting: {
        setOpen: () => {
          this.setState((state) => {
            return {
              ...state,
              legacyPdfSetting: {
                ...state.legacyPdfSetting,
                isOpen: !state.legacyPdfSetting.isOpen,
              },
            };
          });
        },
      },
    },
    updateLegacyPdfSettingTextLabel: () => {
      this.props.onInsertSuccess();
    },
  };

  dbCall = {
    GetParentQuestionBySectionId: (sectionId) => {
      api
        .get()
        .parentQuestionBySectionId(this.actions.getAuthHeader(), sectionId)
        .then((data) => {
          let isToForceUpdate = false;

          const urlQuestionId = this.actions.getQuestionId();

          this.state.data.fields.map((prop) => {
            prop.map((subProp) => {
              if (subProp.id === "parentQuestion") {
                if (data !== "") {
                  let newSelect = [];

                  data.map((dataProp) => {
                    if (dataProp.questionId === parseInt(urlQuestionId, 10)) {
                      return dataProp;
                    } else {
                      newSelect.push({
                        id: dataProp.questionId,
                        name: dataProp.questionLabel,
                        matchFor: "parentQuestion",
                      });

                      return dataProp;
                    }
                  });

                  subProp.selects = List(newSelect);
                } else {
                  subProp.selects = [];
                }

                isToForceUpdate = true;
              }

              if (subProp.id === "optionLabel") {
                subProp.selects = [];
              }
              return subProp;
            });

            return prop;
          });

          if (isToForceUpdate) {
            this.state.data.values.map((prop) => {
              if (prop.id === "parentQuestionId") {
                prop.value = null;
              }
              if (prop.id === "optionLabelId") {
                prop.value = null;
              }

              return prop;
            });
          }

          if (isToForceUpdate) {
            this.forceUpdate();
          }
        });
    },
    GetOptions: (parentQuestionId) => {
      api
        .get()
        .optionsByParentQuestion(this.actions.getAuthHeader(), parentQuestionId)
        .then((data) => {
          const options = data.parentOptions;

          let isToForceUpdate = false;

          this.state.data.fields.map((prop) => {
            prop.map((subProp) => {
              if (subProp.id === "optionLabel") {
                if (options !== null) {
                  let newSelect = [];

                  options.map((dataProp) => {
                    newSelect.push({
                      id: dataProp.optionId,
                      name: dataProp.optionLabel,
                      matchFor: "optionLabel",
                    });

                    return dataProp;
                  });

                  subProp.selects = List(newSelect);
                } else {
                  subProp.selects = [];
                }

                isToForceUpdate = true;
              }

              return subProp;
            });

            return prop;
          });

          this.actions.toggleOptionLabelAndHideLabel(data);

          if (isToForceUpdate) {
            this.forceUpdate();
          }
        });
    },
    InsertNew: (inputs) => {
      api
        .insert()
        .newQuestion(this.actions.getAuthHeader(), inputs)
        .then((data) => {
          if (typeof data.errorId !== "undefined") {
            if (data.errorId === 1) {
              const _that = this;

              _.delay(function () {
                _that.setState((state) => {
                  return {
                    ...state,
                    showConfirmIncrement: true,
                    showConfirmIncrementMessage: data.errorDescription,
                    confirmationNumber: data.confirmationNumber,
                  };
                });
              }, 600);
            }
            if (data.errorId === 2) {
              this.setState((state) => {
                return {
                  ...state,
                  showInsertConfirm: false,
                };
              });

              this.actions.handleShowUpdateError(data.errorDescription);
            }

            this.setState((state) => {
              return {
                ...state,
                showInsertConfirm: false,
              };
            });

            return;
          }

          this.props.history.push(
            `${process.env.PUBLIC_URL}/sections/${data.sectionId}/questions/${data.questionId}`
          );

          this.setState((state) => {
            return {
              ...state,
              showInsertConfirm: false,
              showConfirmIncrement: false,
            };
          });

          const _that = this;

          _.delay(function () {
            _that.actions.showSuccessInsert();
          }, 100);
        })
        .catch(() => {
          this.actions.handleFailedUpdates();
        });
    },
    UpdateExisting: (inputs) => {
      api
        .update()
        .question(
          this.actions.getAuthHeader(),
          inputs,
          this.actions.getQuestionId(),
          this.actions.getSectionId()
        )
        .then((data) => {
          if (data.status === 400) {
            this.actions.handleShowUpdateError(data.data[0].errorDescription);

            return;
          }

          //INFO: invokes signalR
          this.actions.refreshParentQuestionTable();

          if (this.actions.isNewTab()) {
            this.actions.handleSuccessUpdates();

            setTimeout(function () {
              window.close();
            }, 500);

            return;
          }

          const newData = this.actions.assignValues(data);

          this.setState((state) => ({
            ...state,
            data: {
              ...state.data,
              originalValues: List(_.cloneDeep(newData.values)),
            },
          }));

          this.actions.handleSuccessUpdates();
        })
        .catch(() => this.actions.handleFailedUpdates());
    },
    deleteQuestion: (sectionId, questionId) => {
      api
        .delete()
        .questions(this.actions.getAuthHeader(), sectionId, questionId)
        .then((data) => {
          this.actions.handleQuestionDeleteResponse(data);
        });
    },
    generatePDF: (questionId) => {
      api
        .get()
        .questionHtmlPreview(this.actions.getAuthHeader(), questionId)
        .then((base64) => {
          window.open(`${process.env.PUBLIC_URL}${base64}`, "_blank");
        });
    },
  };

  componentDidMount() {
    const { dataValues, filterValues } = this.props;

    this.setState({
      data: dataValues,
      checkRequired: false,
      filterValues: filterValues,
    });

    this.actions.ifEnableMinMax(dataValues);

    this.actions.ifEnableDateAccuracy(dataValues);

    this.actions.registerHub();
  }

  render() {
    const {
      classes,
      title,
      onNewSubQuestion,
      locationState,
      dataValues,
      history,
    } = this.props;

    const legacyPdf = this.actions.handleOnClick.legacyPdfSetting;

    const { data } = this.state;

    const { isQuestionCell, values } = dataValues;

    const versionNumberId = _.find(values.toJS(), { id: "versionNumberId" })
      .value;

    const maxClient = _.find(values.toJS(), { id: "maxClient" }).value;

    const maxAdults = _.find(values.toJS(), { id: "maxAdults" }).value;

    const { previous, next } = this.actions.handleGetNextQuestion();

    if (typeof data.fields === "undefined") {
      return <div>Not available</div>;
    }

    if (this.actions.updateStateIfNotEqual()) {
      return <div>Not available</div>;
    }

    const isNewQuestion = this.actions.getQuestionId().indexOf("new") > -1;

    const htmlContent = _.first(
      _.filter(data.values.toJS(), { id: "htmlContent" })
    );

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <p className={classes.cardCategoryWhite}>
                <span>
                  {isNewQuestion ? (
                    <b>Add New Question</b>
                  ) : title === null ? (
                    "< No Label Indicated >"
                  ) : (
                    title
                  )}
                </span>
              </p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem md={1} />
                <GridItem md={10}>
                  <ShowProgressBar {...this.props} />
                  {data.fields.map((props, keys) => {
                    return (
                      <GridContainer key={keys}>
                        {props.map((propColumn) => {
                          if (typeof propColumn.autoComplete !== "undefined") {
                          }

                          const isHidden =
                            typeof propColumn.hideThis === "undefined"
                              ? false
                              : propColumn.hideThis === true;

                          //If the question is created by the Question Cell
                          if (isHidden === true) {
                            return <span />;
                          }

                          const {
                            previewHtml,
                            handleOnSelectChange,
                            handleOnAutocompleteChange,
                            AutoCompleteInput,
                            handleOnClick,
                          } = this.actions;

                          const htmlPreview = previewHtml.displayTextIfSo(
                            propColumn,
                            htmlContent.value === null ||
                              htmlContent.value.trim() === ""
                          );

                          const AutoComplete = ({ key }) =>
                            propColumn.autoComplete === true ? (
                              <AutoCompleteInput
                                key={key}
                                prop={propColumn}
                                values={data.values}
                                classes={classes}
                                autocomplete={autoComplete}
                                onChange={handleOnAutocompleteChange}
                              />
                            ) : (
                              <SelectInput
                                prop={propColumn}
                                key={key}
                                classes={classes}
                                onChange={handleOnSelectChange}
                                values={data.values}
                                checkRequired={this.state.checkRequired}
                              />
                            );

                          return typeof propColumn.type === "undefined" ? (
                            <React.Fragment>
                              <TextInput
                                prop={propColumn}
                                key={propColumn.id}
                                classes={classes}
                                onChange={this.actions.handleOnTextChange}
                                onClick={handleOnClick.legacyPdfSetting.setOpen}
                                values={data.values}
                                checkRequired={this.state.checkRequired}
                              />
                              {htmlPreview}
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <AutoComplete key={propColumn.id} />
                            </React.Fragment>
                          );
                        })}
                      </GridContainer>
                    );
                  })}
                  <ShowProgressBar {...this.props} />
                </GridItem>
                <GridItem md={1} />
              </GridContainer>
            </CardBody>
            <Divider light={true} style={{ marginTop: "1%" }} />
            <CardFooter style={{ display: "block", marginRight: "1%" }}>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                className={classes.deleteButton}
                onClick={() => this.actions.handleQuestionDelete()}
              >
                Delete
              </Button>
              <Button
                variant="raised"
                size="large"
                color="primary"
                className={classes.button}
                onClick={() =>
                  isNewQuestion
                    ? this.actions.handleInsertNew()
                    : this.actions.handleUpdateExisting()
                }
              >
                Save
              </Button>
              <Link
                to={this.actions.getUrlLikParams(locationState)}
                onClick={(event) => {
                  if (this.actions.isNewTab() === true) {
                    window.close();
                    event.preventDefault();
                    return;
                  }
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  className={classes.button}
                  style={{ marginRight: "1%" }}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                variant="outlined"
                size="small"
                color={"primary"}
                className={classes.button}
                style={{ marginRight: "21%" }}
                disabled={next === 0}
                onClick={() => this.actions.handleOnNextQuestion("next")}
              >
                Next Question
                <Next className={classNames(classes.rightIcon)} />
              </Button>

              <Button
                variant="outlined"
                size="small"
                color={"primary"}
                className={classes.button}
                style={{ marginRight: "1%" }}
                disabled={previous === 0}
                onClick={() => this.actions.handleOnNextQuestion("prev")}
              >
                <Previous className={classNames(classes.leftIcon)} />
                PREV Question
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <QuestionManageGrids
            values={this.state.data.values}
            isNewQuestion={isNewQuestion}
            onNewSubQuestion={onNewSubQuestion}
            showNewTemplateAlert={this.actions.showNewTemplateAlert}
            onResponseType={this.actions.getSelectedResponseType}
            onQuestionId={this.actions.getQuestionId}
            isQuestionCell={isQuestionCell}
            history={history}
          />
        </GridItem>
        <Snackbar
          place="br"
          color="success"
          icon={Beenhere}
          message={
            <span>
              <b>Yes!</b> Updates were saved successfully
            </span>
          }
          open={this.state.showAlert}
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Cancel}
          message={"Oops! Something went wong. Failed to save your changes"}
          open={this.state.showErrorAlert}
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Warning}
          message={this.state.UpdateErrorMessage}
          open={this.state.showUpdateError}
        />
        <Snackbar
          place="br"
          color="success"
          icon={AttachFile}
          message={"Sub Question template now ready"}
          open={this.state.showNewTemplateAlert}
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Warning}
          message={this.state.showLegacyPdfErrorMessage}
          open={this.state.showLegacyPdfError}
        />
        <Snackbar
          place="br"
          color="success"
          icon={Save}
          message={
            <span>
              <b>Success!</b> New question has been created successfully
            </span>
          }
          open={this.state.showSuccessInsert}
        />
        <Snackbar
          place="br"
          color={this.state.deletion.color}
          icon={this.state.deletion.icon}
          message={this.state.deletion.message}
          open={this.state.deletion.isOpen}
        />
        <QuestionDialogNew
          isOpen={this.state.showInsertConfirm}
          yes={this.actions.handleConfirmYes}
          cancel={this.actions.handleConfirmCancel}
        />
        <QuestionDialogDelete
          isOpen={this.state.showDeleteConfirm}
          cancel={this.actions.handleQuestionDeleteCancel}
          yes={this.actions.handleQuestionDeleteYes}
        />
        <QuestionDialogIncrement
          isOpen={this.state.showConfirmIncrement}
          message={this.state.showConfirmIncrementMessage}
          cancel={this.actions.handleOnIncrementCancel}
          yes={this.actions.handleOnIncrementYes}
        />
        <QuestionNextPrevDialog
          isOpen={this.state.showConfirmNextPrevMessage}
          yes={this.actions.handleNextPrevOnClick.yes}
          no={this.actions.handleNextPrevOnClick.no}
          cancel={this.actions.handleNextPrevOnClick.cancel}
        />
        <LegacyPdfDialog
          isOpen={this.state.legacyPdfSetting.isOpen}
          incrementalKey={+new Date()}
          cancel={legacyPdf.setOpen}
          classes={classes}
          formVersionId={versionNumberId}
          maxClient={maxClient}
          maxAdults={maxAdults}
          setLegacyPdfSettingTextLabel={
            this.actions.updateLegacyPdfSettingTextLabel
          }
        />
      </GridContainer>
    );
  }
}

const styles = (theme) => ({
  deleteButton: {
    position: "absolute",
    left: 0,
    marginLeft: "10%",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    fontWeight: "bold",
  },
  menu: {
    width: "100%",
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    marginTop: "0",
    marginBottom: "0",
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
  button: {
    float: "right",
    marginRight: "8%",
  },
  colorPrimary: {
    backgroundColor: "#f5cdff",
  },
  barColorPrimary: {
    backgroundColor: "#a742b9",
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  leftIcon: {
    marginRight: "5px",
  },
  rightIcon: {
    marginLeft: "5px",
  },
  ...autocompleteStyles.getAll(theme),
  autoComplete: {
    marginTop: "1.3%",
    padding: "0px 0px 0px 8px !important",
    width: "100% !important",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  paper: {
    padding: theme.spacing.unit,
    // textAlign: 'center',
    // color: theme.palette.text.secondary,
  },
});

QuestionManageInputs.propTypes = {
  dataValues: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  filterValues: PropTypes.object.isRequired,
  onNewSubQuestion: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onInsertSuccess: PropTypes.func.isRequired,
  locationState: PropTypes.object.isRequired,
  showProgress: PropTypes.bool.isRequired,
};

export default withStyles(styles)(QuestionManageInputs);
