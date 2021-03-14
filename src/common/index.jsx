//npm
import _ from "lodash";
import { List } from "immutable";

//api
import api from "apis/index";

export default {
  getSectionId: () => {
    const url = window.location.href.split("/");

    const sectionId = url[url.length - 3];

    return sectionId;
  },
  getQuestionId: () => {
    const url = window.location.href.split("/");

    const questionId = url[url.length - 1];

    if (questionId.indexOf("&newTab") > -1) {
      return questionId.split("?")[0];
    }

    return questionId;
  },
  getSectionQuestionErrors: (formVersion, section, _that) => {
    const questionList = [..._that.state.table.data.toJS()];

    const authHeaders = _that.actions.getAuthHeader();

    api
      .get()
      .sectionQuestionErrors(authHeaders, formVersion, section)
      .then(response => {
        if (response === "") {
          _that.setState(state => {
            return {
              ...state,
              showNoErrors: true
            };
          });

          _that.actions.showThenHideAlert("showNoErrors");

          return;
        }

        response.map(error => {
          const questionWithError = _.find(questionList, {
            id: error.questionId
          });

          questionWithError.errors = error;

          return error;
        });

        const orderedQuestionList = _.sortBy(questionList, obj => obj.errors);

        _that.setState(state => {
          return {
            ...state,
            table: {
              ...state.table,
              data: List([...orderedQuestionList])
            }
          };
        });

        _that.props.scrollTop();
      });
  },
  apiUrl: () => `${process.env.PUBLIC_URL}/api`
  // apiUrl: () => `http://localhost:61540/api`
};
